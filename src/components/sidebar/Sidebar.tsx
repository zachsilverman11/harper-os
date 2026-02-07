'use client';

import { 
  LayoutGrid, Target, Compass, Plus, 
  ChevronDown, Settings, Search, Zap, X, FileText, Home
} from 'lucide-react';
import { useHarperStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SettingsPanel } from '@/components/settings';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { 
    businesses,
    view, 
    setView, 
    selectedProjectId, 
    setSelectedProject,
    setQuickCaptureOpen, 
    getProjectsByBusiness,
    addProject
  } = useHarperStore();
  
  const [openBusinesses, setOpenBusinesses] = useState<Record<string, boolean>>({
    'inspired-swim': true,
    'inspired-mortgage': true,
    'personal': true,
  });
  
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [addProjectBusinessId, setAddProjectBusinessId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleBusiness = (id: string) => {
    setOpenBusinesses((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleAddProject = () => {
    if (newProjectName.trim() && addProjectBusinessId) {
      addProject(addProjectBusinessId, newProjectName.trim(), newProjectDesc.trim() || undefined);
      setNewProjectName('');
      setNewProjectDesc('');
      setAddProjectOpen(false);
      setAddProjectBusinessId(null);
    }
  };
  
  const openAddProjectDialog = (businessId: string) => {
    setAddProjectBusinessId(businessId);
    setAddProjectOpen(true);
  };

  // Close sidebar on navigation (mobile)
  const handleNavigation = (callback: () => void) => {
    callback();
    onClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        w-64 h-full bg-slate-950 border-r border-slate-800 flex flex-col
        fixed md:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-100">Harper OS</span>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-2 -mr-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      {/* Quick Actions */}
      <div className="px-3 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          onClick={() => setQuickCaptureOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Quick Capture
          <span className="ml-auto text-xs text-slate-600">C</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          onClick={() => {/* TODO: Open search modal */}}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
          <span className="ml-auto text-xs text-slate-600">/</span>
        </Button>
      </div>

      <Separator className="my-3 bg-slate-800" />

      {/* Navigation */}
      <nav className="px-3 space-y-1">
        <Button
          variant={view === 'dashboard' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            view === 'dashboard' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          onClick={() => handleNavigation(() => {
            setView('dashboard');
            setSelectedProject(null);
          })}
        >
          <Home className="h-4 w-4 mr-2" />
          Dashboard
          <span className="ml-auto text-xs text-slate-600 hidden md:inline">H</span>
        </Button>
        <Button
          variant={view === 'today' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            view === 'today' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          onClick={() => handleNavigation(() => {
            setView('today');
            setSelectedProject(null);
          })}
        >
          <Target className="h-4 w-4 mr-2" />
          Today
          <span className="ml-auto text-xs text-slate-600 hidden md:inline">T</span>
        </Button>
        <Button
          variant={view === 'board' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            view === 'board' && !selectedProjectId
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          onClick={() => handleNavigation(() => {
            setView('board');
            setSelectedProject(null);
          })}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          All Tasks
          <span className="ml-auto text-xs text-slate-600 hidden md:inline">B</span>
        </Button>
        <Button
          variant={view === 'goals' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            view === 'goals' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          onClick={() => handleNavigation(() => setView('goals'))}
        >
          <Compass className="h-4 w-4 mr-2" />
          Goals
          <span className="ml-auto text-xs text-slate-600 hidden md:inline">G</span>
        </Button>
        <Button
          variant={view === 'documents' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            view === 'documents' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          onClick={() => handleNavigation(() => setView('documents'))}
        >
          <FileText className="h-4 w-4 mr-2" />
          Documents
          <span className="ml-auto text-xs text-slate-600 hidden md:inline">D</span>
        </Button>
      </nav>

      <Separator className="my-3 bg-slate-800" />

      {/* Businesses & Projects */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
          Projects
        </div>
        
        {businesses.map((business) => {
          const businessProjects = getProjectsByBusiness(business.id);
          
          return (
            <Collapsible
              key={business.id}
              open={openBusinesses[business.id]}
              onOpenChange={() => toggleBusiness(business.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-slate-100 hover:bg-slate-800 mb-1 font-medium"
                >
                  <span className="mr-2">{business.icon}</span>
                  {business.name}
                  <ChevronDown 
                    className={`h-4 w-4 ml-auto transition-transform ${
                      openBusinesses[business.id] ? '' : '-rotate-90'
                    }`} 
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-4">
                {businessProjects.map((project) => (
                  <Button
                    key={project.id}
                    variant="ghost"
                    className={`w-full justify-start text-sm ${
                      selectedProjectId === project.id
                        ? 'bg-slate-800 text-slate-100'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}
                    onClick={() => handleNavigation(() => {
                      setSelectedProject(project.id);
                      setView('board');
                    })}
                  >
                    <div
                      className="h-2 w-2 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate">{project.name}</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-slate-600 hover:text-slate-400 hover:bg-slate-800/50"
                  onClick={() => openAddProjectDialog(business.id)}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Add Project
                </Button>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-500 hover:text-slate-300"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
      
      {/* Settings Panel */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      
      {/* Add Project Dialog */}
      <Dialog open={addProjectOpen} onOpenChange={setAddProjectOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
            <div className="space-y-2">
              <Label htmlFor="project-desc">Description (optional)</Label>
              <Input
                id="project-desc"
                placeholder="Brief description..."
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="bg-slate-800 border-slate-700"
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
    </aside>
    </>
  );
}
