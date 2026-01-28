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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Zap, Send } from 'lucide-react';

export function QuickCapture() {
  const { 
    projects, quickCaptureOpen, setQuickCaptureOpen, 
    addTask, setView, selectedProjectId 
  } = useHarperStore();
  
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(selectedProjectId || projects[0]?.id || '');
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [priority, setPriority] = useState<Priority>('normal');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addTask(projectId, title.trim(), status);
    setTitle('');
    
    // Keep dialog open for rapid entry, or close
    // setQuickCaptureOpen(false);
  };

  const handleQuickSubmit = () => {
    if (!title.trim()) return;
    addTask(projectId, title.trim(), status);
    setTitle('');
    setQuickCaptureOpen(false);
  };

  const project = projects.find((p) => p.id === projectId);

  return (
    <Dialog open={quickCaptureOpen} onOpenChange={setQuickCaptureOpen}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-800">
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
              className="flex-1 bg-slate-800 border-slate-700 text-lg"
              autoFocus
            />
            <Button type="button" onClick={handleQuickSubmit} disabled={!title.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* Project */}
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {project && (
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    )}
                    <span className="truncate">{project?.name || 'Project'}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status */}
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
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

            {/* Priority */}
            <div className="flex gap-1">
              {(['critical', 'high', 'normal', 'low'] as Priority[]).map((p) => (
                <Badge
                  key={p}
                  variant="outline"
                  className={`cursor-pointer text-xs ${PRIORITY_CONFIG[p].bgColor} ${
                    priority === p ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''
                  }`}
                  onClick={() => setPriority(p)}
                >
                  {p.charAt(0).toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">Enter</kbd> to add another, 
            or click send to add and close.
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
