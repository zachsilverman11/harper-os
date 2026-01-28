'use client';

import { useState } from 'react';
import { X, Building2, FolderKanban, Trash2, Edit2, Plus, GripVertical, Check } from 'lucide-react';
import { useHarperStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PROJECT_COLORS } from '@/lib/types';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const {
    businesses,
    projects,
    tasks,
    getProjectsByBusiness,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    addProject,
    updateProject,
    deleteProject,
  } = useHarperStore();

  const [activeTab, setActiveTab] = useState('businesses');
  
  // Business editing state
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);
  const [editBusinessName, setEditBusinessName] = useState('');
  const [editBusinessIcon, setEditBusinessIcon] = useState('');
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessIcon, setNewBusinessIcon] = useState('📁');
  const [addBusinessOpen, setAddBusinessOpen] = useState(false);
  const [deleteBusinessId, setDeleteBusinessId] = useState<string | null>(null);
  
  // Project editing state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectColor, setEditProjectColor] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectBusinessId, setNewProjectBusinessId] = useState<string | null>(null);
  const [newProjectColor, setNewProjectColor] = useState('#3b82f6');
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  // Business handlers
  const startEditBusiness = (id: string, name: string, icon: string) => {
    setEditingBusinessId(id);
    setEditBusinessName(name);
    setEditBusinessIcon(icon);
  };

  const saveBusinessEdit = async () => {
    if (editingBusinessId && editBusinessName.trim()) {
      await updateBusiness(editingBusinessId, { 
        name: editBusinessName.trim(),
        icon: editBusinessIcon,
      });
      setEditingBusinessId(null);
    }
  };

  const handleAddBusiness = async () => {
    if (newBusinessName.trim()) {
      await addBusiness(newBusinessName.trim(), newBusinessIcon);
      setNewBusinessName('');
      setNewBusinessIcon('📁');
      setAddBusinessOpen(false);
    }
  };

  const handleDeleteBusiness = async () => {
    if (deleteBusinessId) {
      await deleteBusiness(deleteBusinessId);
      setDeleteBusinessId(null);
    }
  };

  // Project handlers
  const startEditProject = (id: string, name: string, color: string) => {
    setEditingProjectId(id);
    setEditProjectName(name);
    setEditProjectColor(color);
  };

  const saveProjectEdit = async () => {
    if (editingProjectId && editProjectName.trim()) {
      await updateProject(editingProjectId, { 
        name: editProjectName.trim(),
        color: editProjectColor,
      });
      setEditingProjectId(null);
    }
  };

  const openAddProject = (businessId: string) => {
    setNewProjectBusinessId(businessId);
    setNewProjectName('');
    setNewProjectColor('#3b82f6');
    setAddProjectOpen(true);
  };

  const handleAddProject = async () => {
    if (newProjectName.trim() && newProjectBusinessId) {
      await addProject(newProjectBusinessId, newProjectName.trim(), undefined, newProjectColor);
      setNewProjectName('');
      setAddProjectOpen(false);
      setNewProjectBusinessId(null);
    }
  };

  const handleDeleteProject = async () => {
    if (deleteProjectId) {
      await deleteProject(deleteProjectId);
      setDeleteProjectId(null);
    }
  };

  const getTaskCountForProject = (projectId: string) => {
    return tasks.filter(t => t.projectId === projectId).length;
  };

  const getProjectCountForBusiness = (businessId: string) => {
    return projects.filter(p => p.businessId === businessId && !p.archived).length;
  };

  const EMOJI_OPTIONS = ['📁', '🏊', '🏠', '👤', '💼', '🎯', '🚀', '💡', '📊', '🎨', '🔧', '📱'];

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">Settings</DialogTitle>
            <DialogDescription>
              Manage your businesses and projects
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="businesses" className="data-[state=active]:bg-slate-700">
                <Building2 className="h-4 w-4 mr-2" />
                Businesses
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-slate-700">
                <FolderKanban className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="businesses" className="flex-1 overflow-y-auto mt-4 space-y-2">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 group"
                >
                  {editingBusinessId === business.id ? (
                    <>
                      <select
                        value={editBusinessIcon}
                        onChange={(e) => setEditBusinessIcon(e.target.value)}
                        className="w-12 h-10 bg-slate-700 rounded text-center text-lg"
                      >
                        {EMOJI_OPTIONS.map(emoji => (
                          <option key={emoji} value={emoji}>{emoji}</option>
                        ))}
                      </select>
                      <Input
                        value={editBusinessName}
                        onChange={(e) => setEditBusinessName(e.target.value)}
                        className="flex-1 bg-slate-700 border-slate-600"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveBusinessEdit();
                          if (e.key === 'Escape') setEditingBusinessId(null);
                        }}
                      />
                      <Button size="sm" onClick={saveBusinessEdit}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingBusinessId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">{business.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-slate-200">{business.name}</div>
                        <div className="text-xs text-slate-500">
                          {getProjectCountForBusiness(business.id)} projects
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditBusiness(business.id, business.name, business.icon)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          onClick={() => setDeleteBusinessId(business.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                className="w-full mt-4 border-dashed border-slate-600 text-slate-400 hover:text-slate-200"
                onClick={() => setAddBusinessOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Business
              </Button>
            </TabsContent>

            <TabsContent value="projects" className="flex-1 overflow-y-auto mt-4 space-y-4">
              {businesses.map((business) => {
                const businessProjects = getProjectsByBusiness(business.id);
                return (
                  <div key={business.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <span>{business.icon}</span>
                        {business.name}
                      </h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-500 hover:text-slate-300"
                        onClick={() => openAddProject(business.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {businessProjects.length === 0 ? (
                      <div className="text-sm text-slate-600 italic py-2 px-3">
                        No projects yet
                      </div>
                    ) : (
                      businessProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 group ml-4"
                        >
                          {editingProjectId === project.id ? (
                            <>
                              <div className="flex gap-1">
                                {PROJECT_COLORS.map((color) => (
                                  <button
                                    key={color}
                                    className={`w-5 h-5 rounded-full ${
                                      editProjectColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setEditProjectColor(color)}
                                  />
                                ))}
                              </div>
                              <Input
                                value={editProjectName}
                                onChange={(e) => setEditProjectName(e.target.value)}
                                className="flex-1 bg-slate-700 border-slate-600"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveProjectEdit();
                                  if (e.key === 'Escape') setEditingProjectId(null);
                                }}
                              />
                              <Button size="sm" onClick={saveProjectEdit}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingProjectId(null)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <div
                                className="h-3 w-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: project.color }}
                              />
                              <div className="flex-1">
                                <div className="font-medium text-slate-200">{project.name}</div>
                                <div className="text-xs text-slate-500">
                                  {getTaskCountForProject(project.id)} tasks
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditProject(project.id, project.name, project.color)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                  onClick={() => setDeleteProjectId(project.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Business Dialog */}
      <Dialog open={addBusinessOpen} onOpenChange={setAddBusinessOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Add Business</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center ${
                      newBusinessIcon === emoji 
                        ? 'bg-blue-500/30 ring-2 ring-blue-500' 
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    onClick={() => setNewBusinessIcon(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-name">Name</Label>
              <Input
                id="business-name"
                placeholder="e.g., My Company"
                value={newBusinessName}
                onChange={(e) => setNewBusinessName(e.target.value)}
                className="bg-slate-800 border-slate-700"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddBusiness();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddBusinessOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBusiness} disabled={!newBusinessName.trim()}>
              Add Business
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Project Dialog */}
      <Dialog open={addProjectOpen} onOpenChange={setAddProjectOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {PROJECT_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${
                      newProjectColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewProjectColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                placeholder="e.g., Website Redesign"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="bg-slate-800 border-slate-700"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddProject();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddProjectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProject} disabled={!newProjectName.trim()}>
              Add Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Business Confirmation */}
      <AlertDialog open={!!deleteBusinessId} onOpenChange={() => setDeleteBusinessId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the business and all its projects and tasks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteBusiness}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Project Confirmation */}
      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the project and all its tasks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteProject}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
