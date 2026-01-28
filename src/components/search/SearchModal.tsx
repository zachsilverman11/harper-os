'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, FileText, Target, Compass } from 'lucide-react';
import { useHarperStore } from '@/lib/store';
import { PRIORITY_CONFIG } from '@/lib/types';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const { 
    tasks, projects, goals, searchTasks, 
    setView, setSelectedProject, updateTask 
  } = useHarperStore();
  
  const [query, setQuery] = useState('');

  const filteredTasks = useMemo(() => {
    if (!query.trim()) return tasks.slice(0, 10);
    return searchTasks(query);
  }, [query, tasks, searchTasks]);

  const filteredProjects = useMemo(() => {
    if (!query.trim()) return projects.slice(0, 5);
    const q = query.toLowerCase();
    return projects.filter(
      (p) => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
    );
  }, [query, projects]);

  const handleSelectTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedProject(task.projectId);
      setView('board');
    }
    onOpenChange(false);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    setView('board');
    onOpenChange(false);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'today':
        setView('today');
        break;
      case 'board':
        setView('board');
        setSelectedProject(null);
        break;
      case 'goals':
        setView('goals');
        break;
    }
    onOpenChange(false);
  };

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        onOpenChange(true);
      }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tasks, projects, or type a command..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleAction('today')}>
            <Target className="mr-2 h-4 w-4 text-amber-400" />
            <span>Go to Today</span>
            <span className="ml-auto text-xs text-slate-500">T</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction('board')}>
            <FileText className="mr-2 h-4 w-4 text-blue-400" />
            <span>View All Tasks</span>
            <span className="ml-auto text-xs text-slate-500">B</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAction('goals')}>
            <Compass className="mr-2 h-4 w-4 text-violet-400" />
            <span>View Goals</span>
            <span className="ml-auto text-xs text-slate-500">G</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Projects */}
        {filteredProjects.length > 0 && (
          <CommandGroup heading="Projects">
            {filteredProjects.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => handleSelectProject(project.id)}
              >
                <div
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span>{project.name}</span>
                {project.description && (
                  <span className="ml-2 text-xs text-slate-500 truncate">
                    {project.description}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* Tasks */}
        {filteredTasks.length > 0 && (
          <CommandGroup heading="Tasks">
            {filteredTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              const priorityConfig = PRIORITY_CONFIG[task.priority];
              return (
                <CommandItem
                  key={task.id}
                  onSelect={() => handleSelectTask(task.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: project?.color || '#666' }}
                    />
                    <span className={task.status === 'done' ? 'line-through text-slate-500' : ''}>
                      {task.title}
                    </span>
                    <span className={`ml-auto text-xs ${priorityConfig.color}`}>
                      {task.priority}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
