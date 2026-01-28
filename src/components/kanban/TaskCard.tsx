'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreVertical, Calendar, Link2, User, Clock } from 'lucide-react';
import { Task, PRIORITY_CONFIG, TEAM_MEMBERS } from '@/lib/types';
import { useHarperStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { projects, deleteTask, updateTask, duplicateTask } = useHarperStore();
  const project = projects.find((p) => p.id === task.projectId);
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const assignee = TEAM_MEMBERS.find((m) => m.id === task.assignee);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getDueDateDisplay = () => {
    if (!task.dueDate) return null;
    const date = parseISO(task.dueDate);
    
    if (isToday(date)) return { text: 'Today', className: 'text-amber-400' };
    if (isTomorrow(date)) return { text: 'Tomorrow', className: 'text-blue-400' };
    if (isPast(date)) return { text: format(date, 'MMM d'), className: 'text-rose-400' };
    return { text: format(date, 'MMM d'), className: 'text-slate-500' };
  };

  const dueDisplay = getDueDateDisplay();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group cursor-grab active:cursor-grabbing bg-slate-900 border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-slate-950/50 ${
        task.status === 'done' ? 'opacity-60' : ''
      } ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 text-slate-600 group-hover:text-slate-400 transition-colors">
            <GripVertical className="h-4 w-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-medium text-sm line-clamp-2 ${
                task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-100'
              }`}>
                {task.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-700">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Set Priority</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-slate-900 border-slate-700">
                      {(['critical', 'high', 'normal', 'low'] as const).map((p) => (
                        <DropdownMenuItem
                          key={p}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTask(task.id, { priority: p });
                          }}
                        >
                          <span className={`w-2 h-2 rounded-full mr-2 ${PRIORITY_CONFIG[p].bgColor}`} />
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Assign to</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-slate-900 border-slate-700">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTask(task.id, { assignee: undefined });
                        }}
                      >
                        Unassigned
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {TEAM_MEMBERS.map((member) => (
                        <DropdownMenuItem
                          key={member.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTask(task.id, { assignee: member.id });
                          }}
                        >
                          {member.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateTask(task.id);
                    }}
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="text-rose-400 focus:text-rose-400"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {project && (
                <div className="flex items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-[10px] text-slate-500">{project.name}</span>
                </div>
              )}
              
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${priorityConfig.bgColor}`}
              >
                {task.priority}
              </Badge>
              
              {dueDisplay && (
                <span className={`text-[10px] flex items-center gap-1 ${dueDisplay.className}`}>
                  <Calendar className="h-3 w-3" />
                  {dueDisplay.text}
                </span>
              )}
              
              {task.estimatedMinutes && (
                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.estimatedMinutes}m
                </span>
              )}
              
              {task.links.length > 0 && (
                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  {task.links.length}
                </span>
              )}
              
              {assignee && (
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {assignee.name}
                </span>
              )}
            </div>

            {task.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {task.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded"
                  >
                    #{tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="text-[9px] text-slate-600">+{task.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
