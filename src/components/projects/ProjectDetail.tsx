'use client';

import { useHarperStore } from '@/lib/store';
import { PROJECT_STATUS_CONFIG, Task } from '@/lib/types';
import { ArrowLeft, AlertCircle, CheckCircle2, Wrench, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { useMemo } from 'react';

export function ProjectDetail() {
  const { selectedDetailProjectId, projects, tasks, businesses, setView } = useHarperStore();

  const project = projects.find(p => p.id === selectedDetailProjectId);
  const business = project ? businesses.find(b => b.id === project.businessId) : null;

  const projectTasks = useMemo(() => {
    if (!project) return [];
    return tasks.filter(t => t.projectId === project.id);
  }, [project, tasks]);

  // Group tasks by phase (use tags or notes for phase grouping, or just show all)
  // Since we don't have per-task phase data, show by status
  const tasksByStatus = useMemo(() => {
    const groups = {
      blocked: [] as Task[],
      inProgress: [] as Task[],
      review: [] as Task[],
      todo: [] as Task[],
      done: [] as Task[],
    };

    projectTasks.forEach(t => {
      if (t.assignee === 'zach' && (t.status === 'review' || (t.status as string) === 'needs_review')) {
        groups.blocked.push(t);
      } else if (t.status === 'doing' || (t.status as string) === 'in_progress') {
        groups.inProgress.push(t);
      } else if (t.status === 'review' || (t.status as string) === 'needs_review') {
        groups.review.push(t);
      } else if (t.status === 'done') {
        groups.done.push(t);
      } else {
        groups.todo.push(t);
      }
    });

    // Sort done by completedAt desc
    groups.done.sort((a, b) => {
      if (!a.completedAt) return 1;
      if (!b.completedAt) return -1;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });

    return groups;
  }, [projectTasks]);

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <p className="text-slate-500">Project not found</p>
      </div>
    );
  }

  const statusConfig = PROJECT_STATUS_CONFIG[project.statusLabel] || PROJECT_STATUS_CONFIG.active;
  const phaseProgress = project.totalPhases > 0
    ? Math.round((project.currentPhase / project.totalPhases) * 100)
    : 0;

  return (
    <div className="h-full overflow-auto bg-slate-950">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Back button */}
        <button
          onClick={() => setView('projects')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </button>

        {/* Project header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-3 w-3 rounded-full ${statusConfig.dotColor}`} />
            <h1 className="text-2xl font-bold text-slate-100">{project.name}</h1>
            <span className={`text-xs font-bold tracking-wider px-2.5 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-slate-400 ml-6 mb-3">{project.description}</p>
          )}
          {business && (
            <p className="text-xs text-slate-600 ml-6">{business.icon} {business.name}</p>
          )}
        </div>

        {/* Phase timeline */}
        {project.totalPhases > 1 && (
          <div className="mb-8 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-4">Phase Progress</h2>
            <div className="space-y-2">
              {Array.from({ length: project.totalPhases }, (_, i) => {
                const phaseNum = i + 1;
                const isDone = phaseNum < project.currentPhase;
                const isActive = phaseNum === project.currentPhase;
                const isPlanned = phaseNum > project.currentPhase;

                return (
                  <div key={phaseNum} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-6 text-center ${
                      isDone ? 'text-emerald-400' : isActive ? 'text-blue-400' : 'text-slate-600'
                    }`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4 mx-auto" /> :
                       isActive ? <Wrench className="h-4 w-4 mx-auto" /> :
                       <ClipboardList className="h-4 w-4 mx-auto" />}
                    </div>
                    <div className={`text-sm ${
                      isDone ? 'text-slate-500' : isActive ? 'text-slate-200 font-medium' : 'text-slate-600'
                    }`}>
                      Phase {phaseNum}
                      {isActive && project.phaseName ? ` — ${project.phaseName}` : ''}
                      {isDone && ' ✓'}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${phaseProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {phaseProgress}% through project lifecycle
              </p>
            </div>
          </div>
        )}

        {/* Blocked items */}
        {tasksByStatus.blocked.length > 0 && (
          <TaskSection
            title="⏳ Waiting on You"
            tasks={tasksByStatus.blocked}
            variant="blocked"
          />
        )}

        {/* In Progress */}
        {tasksByStatus.inProgress.length > 0 && (
          <TaskSection
            title="🔧 In Progress"
            tasks={tasksByStatus.inProgress}
            variant="active"
          />
        )}

        {/* In Review */}
        {tasksByStatus.review.length > 0 && (
          <TaskSection
            title="👀 In Review"
            tasks={tasksByStatus.review}
            variant="default"
          />
        )}

        {/* Todo / Backlog */}
        {tasksByStatus.todo.length > 0 && (
          <TaskSection
            title="📋 Planned"
            tasks={tasksByStatus.todo}
            variant="default"
          />
        )}

        {/* Done */}
        {tasksByStatus.done.length > 0 && (
          <TaskSection
            title="✅ Completed"
            tasks={tasksByStatus.done.slice(0, 15)}
            variant="done"
          />
        )}
      </div>
    </div>
  );
}

function TaskSection({
  title,
  tasks,
  variant,
}: {
  title: string;
  tasks: Task[];
  variant: 'blocked' | 'active' | 'done' | 'default';
}) {
  const borderColor = variant === 'blocked' ? 'border-amber-500/20' : 'border-slate-800';

  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-slate-300 mb-3">{title}</h2>
      <div className="space-y-1.5">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`flex items-start gap-3 px-4 py-2.5 rounded-lg border bg-slate-900/30 ${borderColor}`}
          >
            {variant === 'blocked' && <AlertCircle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />}
            {variant === 'done' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/50 mt-0.5 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${variant === 'done' ? 'text-slate-500' : 'text-slate-200'}`}>
                {task.title}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600">
                {task.assignee && <span>{task.assignee}</span>}
                {task.completedAt && variant === 'done' && (
                  <span>{format(new Date(task.completedAt), 'MMM d')}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
