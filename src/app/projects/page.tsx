'use client';

import { useEffect, useState, useCallback } from 'react';
import { getProjects, getBusinesses } from '@/lib/phase2-db';
import { DbProject, DbBusiness } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
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
import { GripVertical } from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  live: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  building: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  blocked: { bg: 'bg-red-500/15', text: 'text-red-400' },
  paused: { bg: 'bg-slate-500/15', text: 'text-slate-400' },
  planned: { bg: 'bg-slate-500/15', text: 'text-slate-400' },
  waiting: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  done: { bg: 'bg-violet-500/15', text: 'text-violet-400' },
};

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.planned;
  return (
    <span className={`px-2 py-0.5 text-[11px] font-semibold uppercase rounded ${colors.bg} ${colors.text}`}>
      {status}
    </span>
  );
}

function SortableProjectCard({ project }: { project: DbProject }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const phaseLabel = project.current_phase && project.total_phases
    ? `Phase ${project.current_phase} of ${project.total_phases}${project.phase_name ? ` — ${project.phase_name}` : ''}`
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-4 py-3.5 bg-[#141414] border border-[#1e1e1e] rounded-lg hover:border-[#2a2a2a] transition-colors group"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Link
        href={`/projects/${project.id}`}
        className="flex-1 flex items-center gap-3 min-w-0"
      >
        <div
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: project.color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">{project.name}</span>
            <StatusBadge status={project.status_label} />
          </div>
          {phaseLabel && (
            <div className="text-xs text-slate-500 mt-0.5">{phaseLabel}</div>
          )}
        </div>
        {project.last_discussed_at && (
          <span className="text-xs text-slate-600 shrink-0">
            {formatDistanceToNow(new Date(project.last_discussed_at), { addSuffix: true })}
          </span>
        )}
      </Link>
    </div>
  );
}

const BUSINESS_ORDER = ['business', 'personal'];
const BUSINESS_LABELS: Record<string, string> = {};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [businesses, setBusinesses] = useState<DbBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    async function load() {
      try {
        const [proj, biz] = await Promise.all([getProjects(), getBusinesses()]);
        setProjects(proj);
        setBusinesses(biz);
      } catch (e) {
        console.error('Failed to load projects:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      // Find the business group for the dragged item
      const activeProject = projects.find((p) => p.id === active.id);
      if (!activeProject) return;

      const groupProjects = projects
        .filter((p) => p.business_id === activeProject.business_id)
        .sort((a, b) => (a.priority_rank || 999) - (b.priority_rank || 999));

      const oldIndex = groupProjects.findIndex((p) => p.id === active.id);
      const newIndex = groupProjects.findIndex((p) => p.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      // Reorder
      const reordered = [...groupProjects];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      // Update priority_rank
      const updates = reordered.map((p, i) => ({ ...p, priority_rank: i }));

      setProjects((prev) => {
        const otherProjects = prev.filter(
          (p) => p.business_id !== activeProject.business_id
        );
        return [...otherProjects, ...updates].sort(
          (a, b) => (a.priority_rank || 999) - (b.priority_rank || 999)
        );
      });

      // Persist
      for (const p of updates) {
        await supabase
          .from('projects')
          .update({ priority_rank: p.priority_rank })
          .eq('id', p.id);
      }
    },
    [projects]
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="skeleton h-8 w-32" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton h-5 w-40" />
            <div className="skeleton h-14 w-full rounded-lg" />
            <div className="skeleton h-14 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Group projects by business
  const grouped = businesses
    .sort((a, b) => a.order - b.order)
    .map((biz) => ({
      business: biz,
      projects: projects
        .filter((p) => p.business_id === biz.id)
        .sort((a, b) => (a.priority_rank || 999) - (b.priority_rank || 999)),
    }))
    .filter((g) => g.projects.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Projects</h1>

      {grouped.map(({ business, projects: groupProjects }) => (
        <section key={business.id}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{business.icon}</span>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              {business.name}
            </h2>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={groupProjects.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {groupProjects.map((project) => (
                  <SortableProjectCard key={project.id} project={project} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      ))}

      {grouped.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No projects found</p>
        </div>
      )}
    </div>
  );
}
