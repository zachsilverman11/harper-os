'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { STATUS_COLUMNS, Task, TaskStatus } from '@/lib/types';
import { useHarperStore } from '@/lib/store';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskDialog } from './TaskDialog';
import { AddTaskDialog } from './AddTaskDialog';

export function KanbanBoard() {
  const { tasks, selectedProjectId, moveTask, getTasksByStatus } = useHarperStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [addingToStatus, setAddingToStatus] = useState<TaskStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  }, [tasks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Determine target column
    let targetStatus: TaskStatus;
    let targetOrder: number;

    // Check if dropped on a column
    if (STATUS_COLUMNS.some((col) => col.key === over.id)) {
      targetStatus = over.id as TaskStatus;
      const tasksInColumn = getTasksByStatus(targetStatus, selectedProjectId);
      targetOrder = tasksInColumn.length;
    } else {
      // Dropped on another task
      const overTask = tasks.find((t) => t.id === over.id);
      if (!overTask) return;
      targetStatus = overTask.status;
      targetOrder = overTask.order;
    }

    if (activeTask.status !== targetStatus || activeTask.order !== targetOrder) {
      moveTask(activeTask.id, targetStatus, targetOrder);
    }
  }, [tasks, moveTask, getTasksByStatus, selectedProjectId]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Handle drag over for visual feedback if needed
  }, []);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 p-6 h-full overflow-x-auto">
          {STATUS_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.key}
              status={column.key}
              label={column.label}
              icon={column.icon}
              tasks={getTasksByStatus(column.key, selectedProjectId)}
              onAddTask={() => setAddingToStatus(column.key)}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
      />

      <AddTaskDialog
        status={addingToStatus}
        open={!!addingToStatus}
        onOpenChange={(open) => !open && setAddingToStatus(null)}
      />
    </>
  );
}
