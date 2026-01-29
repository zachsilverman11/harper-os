'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { TaskStatus, Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  icon: string;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
}

export function KanbanColumn({
  status,
  label,
  icon,
  tasks,
  onAddTask,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const columnColors: Record<TaskStatus, string> = {
    backlog: 'border-slate-700/50',
    this_week: 'border-blue-500/30',
    today: 'border-amber-500/30',
    in_progress: 'border-violet-500/30',
    needs_review: 'border-orange-500/30',
    done: 'border-emerald-500/30',
  };

  return (
    <div className="flex flex-col w-[280px] md:w-72 shrink-0 snap-center md:snap-align-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <h2 className="font-semibold text-sm text-slate-300">{label}</h2>
          <span className="text-xs text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-slate-500 hover:text-slate-300"
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-lg border-2 border-dashed transition-colors ${
          isOver ? 'bg-slate-800/50 border-blue-500/50' : `bg-slate-900/30 ${columnColors[status]}`
        }`}
      >
        <ScrollArea className="h-[calc(100vh-200px)] md:h-[calc(100vh-180px)]">
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2 p-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task)}
                />
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center py-8 text-slate-600 text-sm">
                  Drop tasks here
                </div>
              )}
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
    </div>
  );
}
