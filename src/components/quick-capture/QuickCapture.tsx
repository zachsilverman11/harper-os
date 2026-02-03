'use client';

import { useState, useEffect, useRef } from 'react';
import { useHarperStore } from '@/lib/store';
import { TaskStatus, STATUS_COLUMNS, PRIORITY_CONFIG, Priority } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Zap, Send, ChevronDown, StickyNote } from 'lucide-react';

export function QuickCapture() {
  const { 
    businesses, projects, quickCaptureOpen, setQuickCaptureOpen, 
    addTask, setView, selectedProjectId, getProjectsByBusiness
  } = useHarperStore();
  
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<Priority>('normal');
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (quickCaptureOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [quickCaptureOpen]);

  useEffect(() => {
    if (selectedProjectId) {
      setProjectId(selectedProjectId);
    }
  }, [selectedProjectId]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        setQuickCaptureOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setQuickCaptureOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const taskId = await addTask(projectId, title.trim(), status);
    // If we have notes, update the task with notes
    // Note: addTask returns the ID, we'd need updateTask for notes
    // For now, notes are captured but would need updateTask call
    
    setTitle('');
    setNotes('');
    setShowNotes(false);
  };

  const handleQuickSubmit = async () => {
    if (!title.trim()) return;
    await addTask(projectId, title.trim(), status);
    setTitle('');
    setNotes('');
    setShowNotes(false);
    setQuickCaptureOpen(false);
  };

  const project = projects.find((p) => p.id === projectId);

  const priorityLabels: Record<Priority, string> = {
    critical: '🔴 Critical',
    high: '🟠 High',
    normal: '🔵 Normal',
    low: '⚪ Low',
  };

  return (
    <Dialog open={quickCaptureOpen} onOpenChange={setQuickCaptureOpen}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-800 mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Quick Capture
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 bg-slate-800 border-slate-700 text-base md:text-lg"
              autoFocus
            />
            <Button type="button" onClick={handleQuickSubmit} disabled={!title.trim()} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 items-center">
            {/* Project - Grouped by Business */}
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="col-span-2 sm:w-44 bg-slate-800 border-slate-700">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {project && (
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                    )}
                    <span className="truncate">{project?.name || 'Project'}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {businesses.map((business) => {
                  const businessProjects = getProjectsByBusiness(business.id);
                  if (businessProjects.length === 0) return null;
                  
                  return (
                    <SelectGroup key={business.id}>
                      <SelectLabel className="text-slate-400 font-semibold">
                        {business.icon} {business.name}
                      </SelectLabel>
                      {businessProjects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center gap-2 pl-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: p.color }}
                            />
                            {p.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Status */}
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger className="sm:w-32 bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_COLUMNS.map((col) => (
                  <SelectItem key={col.key} value={col.key}>
                    {col.icon} {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority - Clear Labels */}
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="sm:w-32 bg-slate-800 border-slate-700">
                <SelectValue>
                  {priorityLabels[priority]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(['critical', 'high', 'normal', 'low'] as Priority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {priorityLabels[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Notes */}
          {!showNotes ? (
            <button
              type="button"
              onClick={() => setShowNotes(true)}
              className="text-sm text-slate-500 hover:text-slate-400 flex items-center gap-1"
            >
              <StickyNote className="h-3 w-3" />
              Add notes...
            </button>
          ) : (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional context, links, or details..."
              className="bg-slate-800 border-slate-700 min-h-[80px] text-sm"
              autoFocus
            />
          )}

          <div className="text-xs text-slate-500">
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Enter</kbd> to add another, 
            or click send to add and close.
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
