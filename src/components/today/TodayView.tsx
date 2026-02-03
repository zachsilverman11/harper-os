'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Sun, Target, CheckCircle2, Plus, ChevronRight, 
  Clock, AlertTriangle, Sparkles 
} from 'lucide-react';
import { useHarperStore } from '@/lib/store';
import { Task, PRIORITY_CONFIG } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { TaskDialog } from '@/components/kanban/TaskDialog';

export function TodayView() {
  const { 
    tasks, projects, getTodayTasks, getOverdueTasks, 
    updateTask, getDailyFocus, setDailyFocus 
  } = useHarperStore();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayDisplay = format(new Date(), 'EEEE, MMMM d');
  const dailyFocus = getDailyFocus(today);
  
  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();
  const completedToday = tasks.filter(
    (t) => t.completedAt && format(new Date(t.completedAt), 'yyyy-MM-dd') === today
  );

  const [notes, setNotes] = useState(dailyFocus?.notes || '');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, {
      status: task.status === 'done' ? 'doing' : 'done',
    });
  };

  const handleSaveNotes = () => {
    setDailyFocus(today, { notes });
  };

  const getProject = (projectId: string) => projects.find((p) => p.id === projectId);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Sun className="h-6 w-6 text-amber-400" />
            {greeting()}, Zach
          </h1>
          <p className="text-slate-400 mt-1">{todayDisplay}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>{completedToday.length} completed</span>
          </div>
          {overdueTasks.length > 0 && (
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
              <span>{overdueTasks.length} overdue</span>
            </div>
          )}
        </div>
      </div>

      {/* Overdue Alert */}
      {overdueTasks.length > 0 && (
        <Card className="bg-rose-500/10 border-rose-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueTasks.map((task) => {
              const project = getProject(task.projectId);
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors"
                >
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className="h-5 w-5 rounded-full border-2 border-rose-500/50 hover:bg-rose-500/20"
                  />
                  <div className="flex-1">
                    <span className="text-slate-200">{task.title}</span>
                    {project && (
                      <span className="ml-2 text-xs text-slate-500">
                        {project.name}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-rose-400">
                    Due {task.dueDate}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Today's Focus */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            Today's Focus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No tasks scheduled for today</p>
              <p className="text-sm">Drag tasks to the "Today" column or add a new one</p>
            </div>
          ) : (
            todayTasks.map((task) => {
              const project = getProject(task.projectId);
              const priorityConfig = PRIORITY_CONFIG[task.priority];
              const isCompleted = task.status === 'done';
              
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                    isCompleted 
                      ? 'bg-slate-800/50 opacity-60' 
                      : 'bg-slate-800 hover:bg-slate-700/50'
                  }`}
                  onClick={() => setSelectedTask(task)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(task);
                    }}
                    className={`h-5 w-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] px-1.5 py-0 ${priorityConfig.bgColor}`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    {project && (
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-xs text-slate-500">{project.name}</span>
                        {task.estimatedMinutes && (
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.estimatedMinutes}m
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Quick Notes */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-100">
            Daily Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleSaveNotes}
            placeholder="Capture thoughts, wins, blockers..."
            className="bg-slate-800 border-slate-700 min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Completed Today */}
      {completedToday.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Completed Today ({completedToday.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedToday.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span className="line-through">{task.title}</span>
                </div>
              ))}
              {completedToday.length > 5 && (
                <p className="text-xs text-slate-600">
                  +{completedToday.length - 5} more
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <TaskDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </div>
  );
}
