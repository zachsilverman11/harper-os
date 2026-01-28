'use client';

import { Zap, LayoutGrid, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHarperStore } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { projects, selectedProjectId, setSelectedProject } = useHarperStore();
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-100">Harper OS</span>
        </div>

        <div className="h-6 w-px bg-slate-800" />

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-slate-300">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Board
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-300">
            <Calendar className="h-4 w-4 mr-2" />
            Today
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-slate-700">
              {selectedProject ? (
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: selectedProject.color }}
                  />
                  {selectedProject.name}
                </div>
              ) : (
                'All Projects'
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setSelectedProject(null)}>
              All Projects
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" className="text-slate-500">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
