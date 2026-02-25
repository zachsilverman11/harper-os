'use client';

import { useEffect, useState } from 'react';
import { getLatestWeeklyFocus, getProjects, getTasks, getBusinesses } from '@/lib/phase2-db';
import { DbWeeklyFocus, DbProject, DbTask, DbBusiness } from '@/lib/supabase';
import { CheckCircle, Eye, TrendingUp, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function OverviewPage() {
  const [weeklyFocus, setWeeklyFocus] = useState<DbWeeklyFocus | null>(null);
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [tasks, setTasks] = useState<DbTask[]>([]);
  const [businesses, setBusinesses] = useState<DbBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [wf, proj, t, biz] = await Promise.all([
          getLatestWeeklyFocus(),
          getProjects(),
          getTasks(),
          getBusinesses(),
        ]);
        setWeeklyFocus(wf);
        setProjects(proj);
        setTasks(t);
        setBusinesses(biz);
      } catch (e) {
        console.error('Failed to load overview:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <OverviewSkeleton />;

  const zachTasks = tasks.filter((t) => t.assignee === 'zach' && t.status !== 'done');
  const recentlyDone = tasks.filter((t) => {
    if (t.status !== 'done' || !t.completed_at) return false;
    const doneDate = new Date(t.completed_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return doneDate > weekAgo;
  });

  const focusProjects = weeklyFocus?.active_project_ids
    ? projects.filter((p) => weeklyFocus.active_project_ids?.includes(p.id))
    : [];

  const handleMarkDone = async (taskId: string) => {
    const { updateTaskStatus } = await import('@/lib/phase2-db');
    await updateTaskStatus(taskId, 'done');
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'done', completed_at: new Date().toISOString() }
          : t
      )
    );
  };

  const getProjectName = (projectId: string) =>
    projects.find((p) => p.id === projectId)?.name || '';

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Overview</h1>

      {/* Weekly Focus Banner */}
      <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-amber-500 rounded-full" />
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
            Weekly Focus
          </h2>
        </div>
        {weeklyFocus ? (
          <>
            <p className="text-white text-lg font-medium">
              {weeklyFocus.focus_summary || 'No focus set for this week'}
            </p>
            {focusProjects.length > 0 && (
              <div className="flex gap-2 mt-3">
                {focusProjects.map((p) => (
                  <span
                    key={p.id}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/15 text-amber-300"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-slate-400">No weekly focus set yet.</p>
        )}
      </div>

      {/* Needs Your Eyes */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-4 w-4 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Needs Your Eyes</h2>
        </div>
        {zachTasks.length > 0 ? (
          <div className="space-y-2">
            {zachTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-lg group hover:border-amber-500/30 transition-colors"
              >
                <button
                  onClick={() => handleMarkDone(task.id)}
                  className="h-5 w-5 rounded border border-slate-600 hover:border-amber-400 hover:bg-amber-400/10 flex items-center justify-center transition-colors"
                >
                  <CheckCircle className="h-3 w-3 text-transparent group-hover:text-amber-400" />
                </button>
                <span className="flex-1 text-sm text-slate-200">{task.title}</span>
                <span className="text-xs text-slate-500">{getProjectName(task.project_id)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 bg-[#141414] border border-[#1e1e1e] rounded-lg text-center">
            <p className="text-slate-400 text-sm">Nothing needs your attention right now ✓</p>
          </div>
        )}
      </section>

      {/* Live Metrics Strip */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Live Metrics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* TODO: Wire each metric to real data source */}
          {[
            { label: 'Spring Conversion', /* TODO: connect to swim analytics */ },
            { label: 'LOD Leads', /* TODO: connect to mortgage CRM */ },
            { label: 'Ads ROAS', /* TODO: connect to ad platform */ },
            { label: 'Utilization', /* TODO: connect to scheduling */ },
          ].map((metric) => (
            <div
              key={metric.label}
              className="px-4 py-4 bg-[#141414] border border-[#1e1e1e] rounded-lg"
            >
              <div className="text-xs text-slate-500 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold text-slate-600">—</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Done */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Recently Done</h2>
        </div>
        {recentlyDone.length > 0 ? (
          <div className="space-y-2">
            {recentlyDone.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#1e1e1e] rounded-lg"
              >
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="flex-1 text-sm text-slate-400 line-through">
                  {task.title}
                </span>
                <span className="text-xs text-slate-600">
                  {task.completed_at
                    ? formatDistanceToNow(new Date(task.completed_at), { addSuffix: true })
                    : ''}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 bg-[#141414] border border-[#1e1e1e] rounded-lg text-center">
            <p className="text-slate-500 text-sm">No tasks completed this week</p>
          </div>
        )}
      </section>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <div className="skeleton h-8 w-40" />
      <div className="skeleton h-32 w-full rounded-xl" />
      <div className="space-y-3">
        <div className="skeleton h-6 w-48" />
        <div className="skeleton h-14 w-full rounded-lg" />
        <div className="skeleton h-14 w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-20 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
