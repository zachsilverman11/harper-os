'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Trash2, Calendar, Clock, Link2, Plus, X, User, Tag, ExternalLink 
} from 'lucide-react';

interface TaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDialog({ task, open, onOpenChange }: TaskDialogProps) {
  const { projects, updateTask, deleteTask } = useHarperStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [status, setStatus] = useState<TaskStatus>('backlog');
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
    const newLink: TaskLink = {
      type: 'url',
      url: newLinkUrl.trim(),
      label: newLinkLabel.trim() || new URL(newLinkUrl).hostname,
    };
    setLinks([...links, newLink]);
    setNewLinkUrl('');
    setNewLinkLabel('');
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const project = projects.find((p) => p.id === projectId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 border-slate-700 text-lg font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800 border-slate-700 min-h-[80px]"
              placeholder="What needs to be done?"
            />
          </div>

          {/* Row: Project, Status, Priority */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {project && (
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                      )}
                      <span className="truncate">{project?.name || 'Select'}</span>
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
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_COLUMNS.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.icon} {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={assignee || 'none'} onValueChange={(v) => setAssignee(v === 'none' ? undefined : v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {TEAM_MEMBERS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row: Due Date, Time Estimate */}
          <div className="grid grid-cols-2 gap-3">
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

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Estimate (minutes)
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

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {(['critical', 'high', 'normal', 'low'] as Priority[]).map((p) => (
                <Badge
                  key={p}
                  variant="outline"
                  className={`cursor-pointer ${PRIORITY_CONFIG[p].bgColor} ${
                    priority === p ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-blue-500' : ''
                  }`}
                  onClick={() => setPriority(p)}
                >
                  {PRIORITY_CONFIG[p].label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Tags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Tag className="h-3 w-3" /> Tags
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-300">
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-rose-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="bg-slate-800 border-slate-700 flex-1"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Link2 className="h-3 w-3" /> Links
            </Label>
            {links.length > 0 && (
              <div className="space-y-2 mb-2">
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
                className="bg-slate-800 border-slate-700 flex-1"
              />
              <Input
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                placeholder="Label"
                className="bg-slate-800 border-slate-700 w-24"
              />
              <Button type="button" variant="outline" onClick={handleAddLink}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (syncs to Harper&apos;s memory)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-800 border-slate-700 min-h-[120px]"
              placeholder="Context, decisions, blockers, ideas..."
            />
            <p className="text-xs text-slate-500">
              These notes are indexed and searchable across all your tasks
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
