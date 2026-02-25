'use client';

import { useHarperStore } from '@/lib/store';
import { ProjectCard } from './ProjectCard';
import { ActionSidebar } from './ActionSidebar';
import { useState, useMemo } from 'react';
import { LayoutGrid, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

type FilterKey = 'all' | string; // 'all' or business ID

export function ProjectsGrid() {
  const { projects, tasks, businesses, openProjectDetail } = useHarperStore();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  // Build filter tabs from businesses
  const filters = useMemo(() => {
    const tabs: { key: FilterKey; label: string }[] = [
      { key: 'all', label: 'All' },
    ];
    businesses.forEach(b => {
      tabs.push({ key: b.id, label: b.name });
    });
    return tabs;
  }, [businesses]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => !p.archived)
      .filter(p => activeFilter === 'all' || p.businessId === activeFilter)
      .sort((a, b) => {
        // Sort: active/building/live first, then by updated_at desc
        const statusOrder: Record<string, number> = {
          live: 0, building: 1, active: 2, waiting: 3, planned: 4, paused: 5, done: 6,
        };
        const aOrder = statusOrder[a.statusLabel] ?? 3;
        const bOrder = statusOrder[b.statusLabel] ?? 3;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [projects, activeFilter]);

  // KPI summary
  const stats = useMemo(() => {
    const activeTasks = tasks.filter(t =>
      t.status === 'doing' || (t.status as string) === 'in_progress'
    );
    const thisWeekTasks = tasks.filter(t =>
      (t.status as string) === 'this_week' || t.status === 'todo'
    );
    const doneTasks = tasks.filter(t => t.status === 'done');
    const total = tasks.length;
    const completion = total > 0 ? Math.round((doneTasks.length / total) * 100) : 0;
    const blocked = tasks.filter(
      t => t.assignee === 'zach' && (t.status === 'review' || (t.status as string) === 'needs_review')
    ).length;

    return { active: activeTasks.length, thisWeek: thisWeekTasks.length, total, completion, blocked };
  }, [tasks]);

  return (
    <div className="h-full overflow-auto bg-slate-950">
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-slate-400">{stats.active} in progress</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <LayoutGrid className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400">{stats.thisWeek} queued</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-400">{stats.completion}% complete</span>
          </div>
          {stats.blocked > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400">{stats.blocked} awaiting you</span>
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter.key
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Main layout: Grid + Sidebar */}
        <div className="flex gap-6">
          {/* Projects grid */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={tasks}
                  onClick={() => openProjectDetail(project.id)}
                />
              ))}
            </div>
            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-500 text-sm">No projects found</p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-0">
              <ActionSidebar tasks={tasks} projects={projects} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
