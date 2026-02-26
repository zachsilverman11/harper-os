'use client';

import { useEffect, useState, useCallback } from 'react';
import { getTasks, getProjects, getBusinesses, updateTaskStatus, createTask } from '@/lib/phase2-db';
import { DbTask, DbProject, DbBusiness } from '@/lib/supabase';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { Plus, X, User } from 'lucide-react';

// Map existing task statuses to kanban columns
const KANBAN_COLUMNS = [
  { key: 'backlog', label: 'Backlog', statuses: ['idea', 'backlog', 'todo'] },
  { key: 'in_progress', label: 'In Progress', statuses: ['doing', 'in_progress', 'this_week', 'today', 'needs_review', 'review'] },
  { key: 'done', label: 'Done', statuses: ['done'] },
];

function getKanbanColumn(status: string): string {
  for (const col of KANBAN_COLUMNS) {
    if (col.statuses.includes(status)) return col.key;
  }
  return 'backlog';
}

function getStatusForColumn(column: string): string {
  switch (column) {
    case 'backlog': return 'todo';
    case 'in_progress': return 'doing';
    case 'done': return 'done';
    default: return 'todo';
  }
}

function getBusinessColor(projectId: string, projects: DbProject[], businesses: DbBusiness[]): string {
  const project = projects.find(p => p.id === projectId);
  if (!project) return '#666';
  const biz = businesses.find(b => b.id === project.business_id);
  return biz?.color || project.color;
}

function TaskCard({
  task,
  projects,
  businesses,
  isDragging,
}: {
  task: DbTask;
  projects: DbProject[];
  businesses: DbBusiness[];
  isDragging?: boolean;
}) {
  const project = projects.find((p) => p.id === task.project_id);
  const bizColor = getBusinessColor(task.project_id, projects, businesses);

  return (
    <div
      className={`px-3 py-2.5 bg-[#141414] border border-[#1e1e1e] rounded-lg transition-colors ${
        isDragging ? 'shadow-lg shadow-black/30 border-amber-500/30' : 'hover:border-[#2a2a2a]'
      }`}
    >
      <div className="text-sm text-white mb-2">{task.title}</div>
      <div className="flex items-center gap-2">
        {project && (
          <span
            className="px-1.5 py-0.5 text-[10px] font-medium rounded"
            style={{
              backgroundColor: bizColor + '20',
              color: bizColor,
            }}
          >
            {project.name}
          </span>
        )}
        {task.assignee && (
          <span className="flex items-center gap-1 text-[10px] text-slate-500 ml-auto">
            <User className="h-3 w-3" />
            {task.assignee}
          </span>
        )}
      </div>
    </div>
  );
}

function SortableTaskCard({
  task,
  projects,
  businesses,
}: {
  task: DbTask;
  projects: DbProject[];
  businesses: DbBusiness[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} projects={projects} businesses={businesses} isDragging={isDragging} />
    </div>
  );
}

function KanbanColumn({
  column,
  tasks,
  projects,
  businesses,
}: {
  column: { key: string; label: string };
  tasks: DbTask[];
  projects: DbProject[];
  businesses: DbBusiness[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] flex flex-col rounded-xl transition-colors ${
        isOver ? 'bg-amber-500/5' : ''
      }`}
    >
      <div className="flex items-center gap-2 px-3 py-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-300">{column.label}</h3>
        <span className="text-xs text-slate-600 bg-[#1e1e1e] px-1.5 py-0.5 rounded">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 px-1 pb-4 flex-1 min-h-[200px]">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              projects={projects}
              businesses={businesses}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<DbTask[]>([]);
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [businesses, setBusinesses] = useState<DbBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('harper');
  const [activeTask, setActiveTask] = useState<DbTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    async function load() {
      try {
        const [t, p, b] = await Promise.all([getTasks(), getProjects(), getBusinesses()]);
        setTasks(t);
        setProjects(p);
        setBusinesses(b);
        if (p.length > 0) setNewTaskProject(p[0].id);
      } catch (e) {
        console.error('Failed to load tasks:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filterProject !== 'all' && t.project_id !== filterProject) return false;
    if (filterAssignee !== 'all' && t.assignee !== filterAssignee) return false;
    return true;
  });

  const getColumnTasks = (columnKey: string) =>
    filteredTasks
      .filter((t) => getKanbanColumn(t.status) === columnKey)
      .sort((a, b) => a.order - b.order);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      // Check if dropped on a column or a task within a column
      let targetColumn: string | null = null;

      // Check if over is a column
      if (KANBAN_COLUMNS.some((c) => c.key === over.id)) {
        targetColumn = over.id as string;
      } else {
        // Over is a task — find which column it's in
        const overTask = tasks.find((t) => t.id === over.id);
        if (overTask) {
          targetColumn = getKanbanColumn(overTask.status);
        }
      }

      if (!targetColumn) return;

      const currentColumn = getKanbanColumn(
        tasks.find((t) => t.id === taskId)?.status || 'todo'
      );

      if (currentColumn !== targetColumn) {
        const newStatus = getStatusForColumn(targetColumn);
        // Optimistic update
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: newStatus,
                  updated_at: new Date().toISOString(),
                  completed_at: newStatus === 'done' ? new Date().toISOString() : null,
                }
              : t
          )
        );
        await updateTaskStatus(taskId, newStatus);
      }
    },
    [tasks]
  );

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim() || !newTaskProject) return;
    const created = await createTask({
      project_id: newTaskProject,
      title: newTaskTitle.trim(),
      assignee: newTaskAssignee,
      status: 'todo',
    });
    setTasks((prev) => [...prev, created]);
    setNewTaskTitle('');
    setShowNewTask(false);
  };

  const assignees = [...new Set(tasks.map((t) => t.assignee).filter(Boolean))];

  if (loading) {
    return (
      <div className="px-6 py-8 space-y-4">
        <div className="skeleton h-8 w-32" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 space-y-3">
              <div className="skeleton h-5 w-24" />
              <div className="skeleton h-20 rounded-lg" />
              <div className="skeleton h-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-4 border-b border-[#1e1e1e] flex items-center gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-white">Tasks</h1>

        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="bg-[#141414] border border-[#1e1e1e] rounded-lg px-3 py-1.5 text-sm text-slate-300"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className="bg-[#141414] border border-[#1e1e1e] rounded-lg px-3 py-1.5 text-sm text-slate-300"
        >
          <option value="all">All Assignees</option>
          {assignees.map((a) => (
            <option key={a} value={a!}>
              {a}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowNewTask(true)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-black text-sm font-medium rounded-lg hover:bg-amber-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">New Task</h2>
              <button onClick={() => setShowNewTask(false)} className="text-slate-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <input
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full bg-[#0A0A0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
            />
            <select
              value={newTaskProject}
              onChange={(e) => setNewTaskProject(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-slate-300"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-slate-300"
            >
              <option value="harper">Harper</option>
              <option value="zach">Zach</option>
              <option value="cheri">Cheri</option>
              <option value="greg">Greg</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowNewTask(false)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!newTaskTitle.trim()}
                className="px-4 py-2 text-sm font-medium bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto px-4 py-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 min-h-full">
            {KANBAN_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.key}
                column={column}
                tasks={getColumnTasks(column.key)}
                projects={projects}
                businesses={businesses}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && (
              <TaskCard
                task={activeTask}
                projects={projects}
                businesses={businesses}
                isDragging
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
