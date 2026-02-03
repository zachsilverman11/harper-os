'use client';

import { useEffect, useState } from 'react';
import { 
  Task, Priority, TaskStatus, STATUS_COLUMNS, PRIORITY_CONFIG,
  TEAM_MEMBERS, TaskLink
} from '@/lib/types';
import { useHarperStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { 
  Trash2, Calendar, Clock, Link2, Plus, X, Tag, ExternalLink 
} from 'lucide-react';

interface TaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDialog({ task, open, onOpenChange }: TaskDialogProps) {
  const { projects, businesses, getProjectsByBusiness, updateTask, deleteTask } = useHarperStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>();
  const [assignee, setAssignee] = useState<string | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [links, setLinks] = useState<TaskLink[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setNotes(task.notes || '');
      setPriority(task.priority);
      setStatus(task.status);
      setProjectId(task.projectId);
      setDueDate(task.dueDate || '');
      setEstimatedMinutes(task.estimatedMinutes);
      setAssignee(task.assignee);
      setTags(task.tags || []);
      setLinks(task.links || []);
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;
    updateTask(task.id, {
      title,
      description: description || undefined,
      notes: notes || undefined,
      priority,
      status,
      projectId,
      dueDate: dueDate || undefined,
      estimatedMinutes,
      assignee,
      tags,
      links,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!task) return;
    deleteTask(task.id);
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) return;
    setTags([...tags, newTag.trim().toLowerCase()]);
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    try {
      const newLink: TaskLink = {
        type: 'url',
        url: newLinkUrl.trim(),
        label: newLinkLabel.trim() || new URL(newLinkUrl).hostname,
      };
      setLinks([...links, newLink]);
      setNewLinkUrl('');
      setNewLinkLabel('');
    } catch {
      // Invalid URL
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const project = projects.find((p) => p.id === projectId);

  const priorityOptions = [
    { value: 'critical', label: '🔴 Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { value: 'high', label: '🟠 High', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { value: 'normal', label: '🔵 Normal', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { value: 'low', label: '⚪ Low', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 border-slate-700 text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800 border-slate-700 min-h-[60px]"
              placeholder="What needs to be done?"
            />
          </div>

          {/* Project & Status - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="bg-slate-800 border-slate-700 w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {project && (
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: project.color }}
                        />
                      )}
                      <span className="truncate">{project?.name || 'Select'}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 max-h-60">
                  {businesses.map((business) => {
                    const businessProjects = getProjectsByBusiness(business.id);
                    if (businessProjects.length === 0) return null;
                    return (
                      <SelectGroup key={business.id}>
                        <SelectLabel className="text-slate-500 text-xs">
                          {business.icon} {business.name}
                        </SelectLabel>
                        {businessProjects.map((p) => (
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
                      </SelectGroup>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {STATUS_COLUMNS.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.icon} {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee & Due Date - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={assignee || 'none'} onValueChange={(v) => setAssignee(v === 'none' ? undefined : v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 w-full">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="none">Unassigned</SelectItem>
                  {TEAM_MEMBERS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Due Date
              </Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          {/* Priority & Estimate - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 w-full">
                  <SelectValue>
                    {priorityOptions.find(p => p.value === priority)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {priorityOptions.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Estimate (min)
              </Label>
              <Input
                type="number"
                value={estimatedMinutes || ''}
                onChange={(e) => setEstimatedMinutes(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="30"
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Tags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Tag className="h-3 w-3" /> Tags
            </Label>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="bg-slate-800 border-slate-700 flex-1 h-8 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTag} className="h-8 border-slate-700">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Link2 className="h-3 w-3" /> Links
            </Label>
            {links.length > 0 && (
              <div className="space-y-1 mb-2">
                {links.map((link, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:underline flex-1 truncate"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      {link.label}
                    </a>
                    <button
                      onClick={() => handleRemoveLink(i)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://..."
                className="bg-slate-800 border-slate-700 flex-1 h-8 text-sm"
              />
              <Input
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="Label"
                className="bg-slate-800 border-slate-700 w-20 h-8 text-sm"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddLink} className="h-8 border-slate-700">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-800 border-slate-700 min-h-[80px]"
              placeholder="Context, decisions, blockers..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <Button
              variant="ghost"
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700">
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
