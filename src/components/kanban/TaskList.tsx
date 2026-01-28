'use client';

import { useState } from 'react';
import { useHarperStore } from '@/lib/store';
import { Task, TaskStatus, ASSIGNEES } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertCircle, Clock, Calendar, Tag, User, 
  ChevronRight, GripVertical, MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskDialog } from './TaskDialog';

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'backlog', label: 'Backlog', color: 'bg-slate-500' },
  { value: 'this_week', label: 'This Week', color: 'bg-amber-500' },
  { value: 'today', label: 'Today', color: 'bg-blue-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-violet-500' },
  { value: 'done', label: 'Done', color: 'bg-emerald-500' },
];

const PRIORITY_COLORS = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  normal: 'text-slate-400',
  low: 'text-slate-600',
};

interface TaskRowProps {
  task: Task;
  projectName?: string;
  projectColor?: string;
  onTaskClick?: (task: Task) => void;
}

function TaskRow({ task, projectName, projectColor, onTaskClick }: TaskRowProps) {
  const { updateTask, deleteTask, duplicateTask, getProjectById } = useHarperStore();
  const project = getProjectById(task.projectId);

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
  };

  const handleToggleDone = () => {
    updateTask(task.id, { 
      status: task.status === 'done' ? 'today' : 'done' 
    });
  };

  return (
    <div 
      className="group flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 border-b border-slate-800/50 transition-colors cursor-pointer"
      onClick={() => onTaskClick?.(task)}
    >
      {/* Checkbox */}
      <Checkbox
        checked={task.status === 'done'}
        onCheckedChange={handleToggleDone}
        onClick={(e) => e.stopPropagation()}
        className="border-slate-600"
      />

      {/* Priority indicator */}
      <div className={`w-1 h-8 rounded-full ${
        task.priority === 'critical' ? 'bg-red-500' :
        task.priority === 'high' ? 'bg-orange-500' :
        task.priority === 'normal' ? 'bg-slate-600' : 'bg-slate-700'
      }`} />

      {/* Task title & details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
            {task.title}
          </span>
          {task.harperAction && (
            <Badge variant="outline" className="text-xs bg-violet-500/10 border-violet-500/30 text-violet-400">
              ⚡ Harper
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
          {/* Project */}
          {project && (
            <span className="flex items-center gap-1">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </span>
          )}
          
          {/* Due date */}
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
          
          {/* Time estimate */}
          {task.estimatedMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.estimatedMinutes}m
            </span>
          )}
          
          {/* Tags */}
          {task.tags.length > 0 && (
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {task.tags.slice(0, 2).join(', ')}
              {task.tags.length > 2 && `+${task.tags.length - 2}`}
            </span>
          )}
        </div>
      </div>

      {/* Assignee */}
      {task.assignee && (
        <Badge variant="outline" className="text-xs">
          {ASSIGNEES.find(a => a.id === task.assignee)?.name || task.assignee}
        </Badge>
      )}

      {/* Status dropdown */}
      <div onClick={(e) => e.stopPropagation()}>
        <Select value={task.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-32 h-8 text-xs bg-slate-900 border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${option.color}`} />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions menu */}
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
            <DropdownMenuItem onClick={() => duplicateTask(task.id)}>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => deleteTask(task.id)}
              className="text-red-400 focus:text-red-400"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface TaskListProps {
  projectId?: string | null;
}

export function TaskList({ projectId }: TaskListProps) {
  const { tasks, getProjectById } = useHarperStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter tasks by project if specified
  const filteredTasks = projectId
    ? tasks.filter((t) => t.projectId === projectId)
    : tasks;

  // Group by status
  const groupedTasks = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status.value] = filteredTasks
      .filter((t) => t.status === status.value)
      .sort((a, b) => {
        // Sort by priority first, then by order
        const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.order - b.order;
      });
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const nonEmptyStatuses = STATUS_OPTIONS.filter(
    (s) => groupedTasks[s.value].length > 0
  );

  if (filteredTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        No tasks yet. Press <kbd className="mx-1 px-2 py-1 bg-slate-800 rounded text-xs">C</kbd> to create one.
      </div>
    );
  }

  return (
    <>
      <div className="h-full overflow-auto">
        {nonEmptyStatuses.map((status) => (
          <div key={status.value} className="mb-6">
            {/* Status header */}
            <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 bg-slate-950/95 backdrop-blur border-b border-slate-800">
              <div className={`h-2 w-2 rounded-full ${status.color}`} />
              <span className="font-medium text-sm text-slate-300">{status.label}</span>
              <span className="text-xs text-slate-600 ml-1">
                ({groupedTasks[status.value].length})
              </span>
            </div>
            
            {/* Tasks */}
            <div>
              {groupedTasks[status.value].map((task) => (
                <TaskRow 
                  key={task.id} 
                  task={task} 
                  onTaskClick={setSelectedTask}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <TaskDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />
    </>
  );
}
