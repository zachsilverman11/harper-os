'use client';

import { 
  LayoutGrid, Target, Compass, Calendar, Plus, 
  ChevronDown, Settings, Search, Zap
} from 'lucide-react';
import { useHarperStore } from '@/lib/store';
import { LIFE_AREA_CONFIG, LifeArea } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

export function Sidebar() {
  const { 
    projects, view, setView, selectedProjectId, setSelectedProject,
    setQuickCaptureOpen, setSearchQuery, getProjectsByLifeArea
  } = useHarperStore();
  
  const [openAreas, setOpenAreas] = useState<Record<string, boolean>>({
    business: true,
    personal: true,
  });

  const toggleArea = (area: string) => {
    setOpenAreas((prev) => ({ ...prev, [area]: !prev[area] }));
  };

  const lifeAreas: LifeArea[] = ['business', 'personal', 'health', 'family', 'learning'];

  return (
    <aside className="w-64 h-full bg-slate-950 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-lg text-slate-100">Harper OS</span>
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
          variant={view === 'today' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            view === 'today' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          onClick={() => {
            setView('today');
            setSelectedProject(null);
          }}
        >
          <Target className="h-4 w-4 mr-2" />
          Today
          <span className="ml-auto text-xs text-slate-600">T</span>
        </Button>
        <Button
          variant={view === 'board' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            view === 'board' && !selectedProjectId
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          onClick={() => {
            setView('board');
            setSelectedProject(null);
          }}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          All Tasks
          <span className="ml-auto text-xs text-slate-600">B</span>
        </Button>
        <Button
          variant={view === 'goals' ? 'secondary' : 'ghost'}
          className={`w-full justify-start ${
            view === 'goals' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          onClick={() => setView('goals')}
        >
          <Compass className="h-4 w-4 mr-2" />
          Goals
          <span className="ml-auto text-xs text-slate-600">G</span>
        </Button>
      </nav>

      <Separator className="my-3 bg-slate-800" />

      {/* Projects by Life Area */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
          Projects
        </div>
        
        {lifeAreas.map((area) => {
          const areaProjects = getProjectsByLifeArea(area);
          if (areaProjects.length === 0) return null;
          
          const config = LIFE_AREA_CONFIG[area];
          
          return (
            <Collapsible
              key={area}
              open={openAreas[area]}
              onOpenChange={() => toggleArea(area)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-400 hover:text-slate-100 hover:bg-slate-800 mb-1"
                >
                  <span className="mr-2">{config.icon}</span>
                  {config.label}
                  <ChevronDown 
                    className={`h-4 w-4 ml-auto transition-transform ${
                      openAreas[area] ? '' : '-rotate-90'
                    }`} 
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-4">
                {areaProjects.map((project) => (
                  <Button
                    key={project.id}
                    variant="ghost"
                    className={`w-full justify-start text-sm ${
                      selectedProjectId === project.id
                        ? 'bg-slate-800 text-slate-100'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}
                    onClick={() => {
                      setSelectedProject(project.id);
                      setView('board');
                    }}
                  >
                    <div
                      className="h-2 w-2 rounded-full mr-2"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="truncate">{project.name}</span>
                  </Button>
                ))}
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
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
