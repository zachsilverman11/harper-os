'use client';

import { Project, Task, PROJECT_STATUS_CONFIG } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  onClick: () => void;
}

export function ProjectCard({ project, tasks, onClick }: ProjectCardProps) {
  const statusConfig = PROJECT_STATUS_CONFIG[project.statusLabel] || PROJECT_STATUS_CONFIG.active;

  // Derive data from tasks
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const activeTask = projectTasks.find(t =>
    t.status === 'doing' || (t.status as string) === 'in_progress'
  );
  const blockedTasks = projectTasks.filter(
    t => t.assignee === 'zach' && (t.status === 'review' || (t.status as string) === 'needs_review')
  );
  const isBlocked = blockedTasks.length > 0;

  // Staleness check
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(project.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const isStale = daysSinceUpdate > 7;

  // Phase progress
  const phaseProgress = project.totalPhases > 0
    ? Math.round((project.currentPhase / project.totalPhases) * 100)
    : 0;

  // Last active text
  const lastActiveText = daysSinceUpdate === 0
    ? 'today'
    : formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true });

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-slate-900/60 border rounded-xl p-4 hover:border-slate-600 transition-all group cursor-pointer ${
        isBlocked ? 'border-amber-500/30' : 'border-slate-800'
      }`}
    >
      {/* Header: Status dot + Title + Badge */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${statusConfig.dotColor}`} />
        <h3 className="font-semibold text-slate-100 truncate flex-1 text-sm">
          {project.name}
        </h3>
        <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-xs text-slate-500 line-clamp-1 mb-3 ml-5">
          {project.description}
        </p>
      )}

      {/* Phase indicator */}
      {project.totalPhases > 1 && (
        <div className="mb-3 ml-5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>Phase {project.currentPhase} of {project.totalPhases}{project.phaseName ? ` — ${project.phaseName}` : ''}</span>
            <span>{phaseProgress}%</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
              style={{ width: `${phaseProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Current active task */}
      {activeTask && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 ml-5">
          <span className="text-blue-400">🔧</span>
          <span className="truncate">
            {activeTask.assignee ? `${activeTask.assignee}: ` : ''}{activeTask.title}
          </span>
        </div>
      )}

      {/* Blocked indicator */}
      {isBlocked && (
        <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-2 ml-5">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">
            Waiting: {blockedTasks[0].title}{blockedTasks.length > 1 ? ` (+${blockedTasks.length - 1})` : ''}
          </span>
        </div>
      )}

      {/* Last active */}
      <div className="text-[11px] text-slate-600 ml-5 mt-2">
        Last active: {isStale ? '⚠️ ' : ''}{lastActiveText}
      </div>
    </button>
  );
}
