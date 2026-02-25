'use client';

import { useEffect, useState, useCallback } from 'react';
import { getLatestWeeklyFocus, getProjects, getBusinesses, updateProjectPriorityRank } from '@/lib/phase2-db';
import { DbWeeklyFocus, DbProject, DbBusiness } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { Calendar, Target, GripVertical } from 'lucide-react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const STATUS_COLORS: Record<string, string> = {
  live: 'text-emerald-400',
  active: 'text-emerald-400',
  building: 'text-blue-400',
  blocked: 'text-red-400',
  paused: 'text-slate-500',
  planned: 'text-slate-400',
};

function SortableProjectRow({ project, businesses }: { project: DbProject; businesses: DbBusiness[] }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const biz = businesses.find((b) => b.id === project.business_id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-lg hover:border-[#2a2a2a] transition-colors"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div
        className="h-2.5 w-2.5 rounded-full shrink-0"
        style={{ backgroundColor: project.color }}
      />
      <Link href={`/projects/${project.id}`} className="flex-1 min-w-0">
        <span className="text-sm font-medium text-white hover:text-amber-400 transition-colors">
          {project.name}
        </span>
      </Link>
      {biz && (
        <span className="text-[10px] text-slate-500">{biz.name}</span>
      )}
      <span className={`text-[11px] font-semibold uppercase ${STATUS_COLORS[project.status_label] || 'text-slate-400'}`}>
        {project.status_label}
      </span>
    </div>
  );
}

export default function ThisWeekPage() {
  const [weeklyFocus, setWeeklyFocus] = useState<DbWeeklyFocus | null>(null);
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [businesses, setBusinesses] = useState<DbBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    async function load() {
      try {
        const [wf, proj, biz] = await Promise.all([
          getLatestWeeklyFocus(),
          getProjects(),
          getBusinesses(),
        ]);
        setWeeklyFocus(wf);
        setProjects(proj.sort((a, b) => (a.priority_rank || 999) - (b.priority_rank || 999)));
        setBusinesses(biz);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const focusProjects = weeklyFocus?.active_project_ids
    ? projects.filter((p) => weeklyFocus.active_project_ids?.includes(p.id))
    : [];

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...projects];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      const updated = reordered.map((p, i) => ({ ...p, priority_rank: i }));
      setProjects(updated);

      for (const p of updated) {
        await updateProjectPriorityRank(p.id, p.priority_rank);
      }
    },
    [projects]
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="skeleton h-8 w-40" />
        <div className="skeleton h-24 rounded-xl" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-14 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6 text-amber-400" />
        <h1 className="text-2xl font-bold text-white">This Week</h1>
      </div>

      {/* Active Focus */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Active Focus</h2>
        <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-6">
          {weeklyFocus ? (
            <>
              <p className="text-white text-lg font-medium">
                {weeklyFocus.focus_summary || 'No focus summary set'}
              </p>
              {focusProjects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {focusProjects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-colors"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-400">No weekly focus set. Harper will set one soon.</p>
          )}
        </div>
      </section>

      {/* Priority Stack */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Priority Stack</h2>
          <span className="text-xs text-slate-500">Drag to reorder</span>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {projects.map((project, index) => (
                <div key={project.id} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-5 text-right">{index + 1}</span>
                  <div className="flex-1">
                    <SortableProjectRow project={project} businesses={businesses} />
                  </div>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </section>
    </div>
  );
}
