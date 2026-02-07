'use client';

import { useHarperStore } from '@/lib/store';
import { Project, Task } from '@/lib/types';
import { Clock, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, DollarSign, Users, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

interface KPIData {
  websiteSessions: {
    value: number;
    trend: number;
    trendUp: boolean;
  };
  organicTraffic: {
    value: number;
    trend: number;
    trendUp: boolean;
  };
  bookings: {
    value: number;
    trend: number;
    trendUp: boolean;
  };
  bounceRate: {
    value: number;
    trend: number;
    trendUp: boolean;
  };
}

export function DashboardView() {
  const { projects, tasks, businesses, getTasksByStatus } = useHarperStore();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [kpiError, setKpiError] = useState<string | null>(null);

  // Fetch KPI data on mount
  useEffect(() => {
    async function fetchKPIs() {
      try {
        setKpiLoading(true);
        setKpiError(null);
        const response = await fetch('/api/kpis');
        
        if (!response.ok) {
          throw new Error('Failed to fetch KPI data');
        }
        
        const data = await response.json();
        setKpiData(data);
      } catch (err) {
        console.error('Error fetching KPIs:', err);
        setKpiError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setKpiLoading(false);
      }
    }

    fetchKPIs();
  }, []);

  // Get task counts by status (handle both old and new status values)
  const doingTasks = tasks.filter(t => 
    t.status === 'doing' || t.status === 'in_progress' as any
  );
  const todoTasks = tasks.filter(t => 
    t.status === 'todo' || t.status === 'backlog' as any
  );
  const reviewTasks = tasks.filter(t => 
    t.status === 'review' || t.status === 'needs_review' as any
  );
  const doneTasks = tasks
    .filter(t => t.status === 'done')
    .sort((a, b) => {
      if (!a.completedAt) return 1;
      if (!b.completedAt) return -1;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    })
    .slice(0, 10);

  // Get tasks that need attention (blocked or in review)
  const needsAttention = tasks.filter(
    (t) => t.status === 'review' || (t.status as any) === 'needs_review' || 
    (t.notes && t.notes.toLowerCase().includes('blocked'))
  );

  // Calculate project stats
  const getProjectStats = (project: Project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    const doing = projectTasks.filter((t) => 
      t.status === 'doing' || (t.status as any) === 'in_progress'
    ).length;
    const todo = projectTasks.filter((t) => 
      t.status === 'todo' || (t.status as any) === 'backlog'
    ).length;
    const blocked = projectTasks.filter(
      (t) => t.notes && t.notes.toLowerCase().includes('blocked')
    ).length;
    const completed = projectTasks.filter((t) => t.status === 'done').length;
    const total = projectTasks.length;

    return { doing, todo, blocked, completed, total };
  };

  // Helper to format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="h-full overflow-auto bg-slate-950">
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {kpiLoading ? (
            // Loading state
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 md:p-4 animate-pulse"
                >
                  <div className="h-5 w-5 bg-slate-800 rounded mb-2" />
                  <div className="h-8 bg-slate-800 rounded mb-2" />
                  <div className="h-4 bg-slate-800 rounded w-24" />
                </div>
              ))}
            </>
          ) : kpiError ? (
            // Error state - show placeholder message
            <div className="col-span-2 lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
              <p className="text-slate-500 text-sm">
                Unable to load KPI data. {kpiError}
              </p>
            </div>
          ) : kpiData ? (
            // Real data
            <>
              <KPICard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Website Sessions"
                value={formatNumber(kpiData.websiteSessions.value)}
                trend={`${kpiData.websiteSessions.trend >= 0 ? '+' : ''}${kpiData.websiteSessions.trend.toFixed(1)}%`}
                trendUp={kpiData.websiteSessions.trendUp}
              />
              <KPICard
                icon={<Users className="h-5 w-5" />}
                label="Organic Traffic"
                value={formatNumber(kpiData.organicTraffic.value)}
                trend={`${kpiData.organicTraffic.trend >= 0 ? '+' : ''}${kpiData.organicTraffic.trend.toFixed(1)}%`}
                trendUp={kpiData.organicTraffic.trendUp}
              />
              <KPICard
                icon={<CheckCircle2 className="h-5 w-5" />}
                label="Bookings (MTD)"
                value={kpiData.bookings.value.toString()}
                trend={kpiData.bookings.trend === 0 ? '—' : `${kpiData.bookings.trend >= 0 ? '+' : ''}${kpiData.bookings.trend.toFixed(1)}%`}
                trendUp={kpiData.bookings.trendUp}
              />
              <KPICard
                icon={<BarChart3 className="h-5 w-5" />}
                label="Bounce Rate"
                value={`${kpiData.bounceRate.value.toFixed(1)}%`}
                trend={`${kpiData.bounceRate.trend >= 0 ? '+' : ''}${kpiData.bounceRate.trend.toFixed(1)}%`}
                trendUp={kpiData.bounceRate.trendUp}
              />
            </>
          ) : (
            // No data fallback
            <div className="col-span-2 lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
              <p className="text-slate-500 text-sm">No KPI data available</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content - 2 columns */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            {/* Active Work */}
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                Active Work
                <span className="text-sm text-slate-500 font-normal">
                  ({doingTasks.length})
                </span>
              </h2>
              <div className="space-y-2">
                {doingTasks.length === 0 ? (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 text-center">
                    <p className="text-slate-500">No active tasks</p>
                  </div>
                ) : (
                  doingTasks.slice(0, 8).map((task) => (
                    <TaskCard key={task.id} task={task} projects={projects} />
                  ))
                )}
              </div>
            </section>

            {/* Project Cards */}
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-violet-400" />
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {projects
                  .filter((p) => !p.archived)
                  .slice(0, 6)
                  .map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      stats={getProjectStats(project)}
                    />
                  ))}
              </div>
            </section>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-4 md:space-y-6">
            {/* Needs Attention */}
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                Needs Your Attention
                <span className="text-sm text-slate-500 font-normal">
                  ({needsAttention.length})
                </span>
              </h2>
              <div className="space-y-2">
                {needsAttention.length === 0 ? (
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-500">All clear! 🎉</p>
                  </div>
                ) : (
                  needsAttention.slice(0, 5).map((task) => (
                    <AttentionCard key={task.id} task={task} projects={projects} />
                  ))
                )}
              </div>
            </section>

            {/* Recent Completions */}
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Recent Completions
              </h2>
              <div className="space-y-2">
                {doneTasks.map((task) => (
                  <CompletionCard key={task.id} task={task} projects={projects} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  trend,
  trendUp,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 md:p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="text-slate-400">{icon}</div>
        <div
          className={`text-xs font-medium flex items-center gap-1 ${
            trendUp ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {trendUp ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {trend}
        </div>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-slate-100 mb-1">{value}</div>
      <div className="text-xs md:text-sm text-slate-500">{label}</div>
    </div>
  );
}

function ProjectCard({
  project,
  stats,
}: {
  project: Project;
  stats: { doing: number; todo: number; blocked: number; completed: number; total: number };
}) {
  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="h-3 w-3 rounded-full mt-1 flex-shrink-0"
          style={{ backgroundColor: project.color }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 truncate">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 bg-blue-500 rounded-full" />
          <span className="text-slate-400">
            {stats.doing} <span className="text-slate-600">doing</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 bg-slate-500 rounded-full" />
          <span className="text-slate-400">
            {stats.todo} <span className="text-slate-600">todo</span>
          </span>
        </div>
        {stats.blocked > 0 && (
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-amber-500 rounded-full" />
            <span className="text-amber-400">
              {stats.blocked} <span className="text-slate-600">blocked</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, projects }: { task: Task; projects: Project[] }) {
  const project = projects.find((p) => p.id === task.projectId);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-2">
        {project && (
          <div
            className="h-2 w-2 rounded-full mt-1.5 flex-shrink-0"
            style={{ backgroundColor: project.color }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-200 text-sm mb-1">{task.title}</div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {project && <span>{project.name}</span>}
            {task.assignee && (
              <>
                <span>•</span>
                <span>{task.assignee}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttentionCard({ task, projects }: { task: Task; projects: Project[] }) {
  const project = projects.find((p) => p.id === task.projectId);
  const isBlocked = task.notes && task.notes.toLowerCase().includes('blocked');

  return (
    <div className="bg-slate-900/50 border border-amber-500/30 rounded-lg p-3 hover:border-amber-500/50 transition-colors">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-200 text-sm mb-1">{task.title}</div>
          <div className="flex items-center gap-2 text-xs">
            {isBlocked && (
              <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                Blocked
              </span>
            )}
            {task.status === 'review' && (
              <span className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                Needs Review
              </span>
            )}
            {project && <span className="text-slate-500">{project.name}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompletionCard({ task, projects }: { task: Task; projects: Project[] }) {
  const project = projects.find((p) => p.id === task.projectId);
  const completedDate = task.completedAt
    ? format(new Date(task.completedAt), 'MMM d')
    : '';

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex items-start gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-slate-300 text-sm mb-1 line-through decoration-slate-700">
            {task.title}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {completedDate && <span>{completedDate}</span>}
            {project && (
              <>
                <span>•</span>
                <span>{project.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
