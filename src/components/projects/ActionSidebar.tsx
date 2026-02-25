'use client';

import { Task, Project } from '@/lib/types';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { format, isAfter, subDays } from 'date-fns';

interface ActionSidebarProps {
  tasks: Task[];
  projects: Project[];
}

export function ActionSidebar({ tasks, projects }: ActionSidebarProps) {
  // Tasks needing Zach's input: assignee=zach AND status=needs_review or review
  const needsInput = tasks.filter(
    t => t.assignee === 'zach' && (t.status === 'review' || (t.status as string) === 'needs_review')
  );

  // Recently done: completed in last 7 days
  const sevenDaysAgo = subDays(new Date(), 7);
  const recentlyDone = tasks
    .filter(t => t.status === 'done' && t.completedAt && isAfter(new Date(t.completedAt), sevenDaysAgo))
    .sort((a, b) => {
      if (!a.completedAt) return 1;
      if (!b.completedAt) return -1;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    })
    .slice(0, 12);

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || '';
  };

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#3b82f6';
  };

  return (
    <div className="w-full space-y-6">
      {/* Needs Your Input */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-amber-400">Needs Your Input</h3>
          {needsInput.length > 0 && (
            <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-medium">
              {needsInput.length}
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          {needsInput.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-600">All clear 🎉</p>
            </div>
          ) : (
            needsInput.map(task => (
              <div
                key={task.id}
                className="bg-slate-900/40 border border-amber-500/20 rounded-lg px-3 py-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-200 line-clamp-2">{task.title}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div
                        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getProjectColor(task.projectId) }}
                      />
                      <span className="text-[10px] text-slate-500">{getProjectName(task.projectId)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recently Done */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-300">Recently Done</h3>
        </div>
        <div className="space-y-1">
          {recentlyDone.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-600">Nothing completed recently</p>
            </div>
          ) : (
            recentlyDone.map(task => (
              <div
                key={task.id}
                className="flex items-start gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-900/40 transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/60 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-400 line-clamp-1">{task.title}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-slate-600">
                      {task.completedAt ? format(new Date(task.completedAt), 'MMM d') : ''}
                    </span>
                    <span className="text-[10px] text-slate-700">·</span>
                    <span className="text-[10px] text-slate-600">{getProjectName(task.projectId)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
