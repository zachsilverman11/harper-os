'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { KanbanBoard, TaskList } from '@/components/kanban';
import { TodayView } from '@/components/today/TodayView';
import { GoalsView } from '@/components/goals/GoalsView';
import { QuickCapture } from '@/components/quick-capture/QuickCapture';
import { SearchModal } from '@/components/search/SearchModal';
import { useHarperStore } from '@/lib/store';
import { KEYBOARD_SHORTCUTS } from '@/lib/types';
import { LayoutGrid, List } from 'lucide-react';

export default function Home() {
  const { view, setView, setQuickCaptureOpen, selectedProjectId, projects, boardViewMode, setBoardViewMode, initialize, isLoading, isInitialized } = useHarperStore();
  const [searchOpen, setSearchOpen] = useState(false);

  // Initialize from Supabase on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      
      // Escape always works
      if (e.key === 'Escape') {
        setSearchOpen(false);
        return;
      }
      
      if (isInput) return;
      
      switch (e.key.toLowerCase()) {
        case KEYBOARD_SHORTCUTS.today:
          e.preventDefault();
          setView('today');
          break;
        case KEYBOARD_SHORTCUTS.board:
          e.preventDefault();
          setView('board');
          break;
        case KEYBOARD_SHORTCUTS.goals:
          e.preventDefault();
          setView('goals');
          break;
        case KEYBOARD_SHORTCUTS.newTask:
          e.preventDefault();
          setQuickCaptureOpen(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setView, setQuickCaptureOpen]);

  const selectedProject = selectedProjectId 
    ? projects.find((p) => p.id === selectedProjectId) 
    : null;

  return (
    <main className="h-screen flex bg-slate-950 text-slate-100 overflow-hidden">
      {/* Loading overlay */}
      {isLoading && !isInitialized && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">Loading...</span>
          </div>
        </div>
      )}
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header for board view */}
        {view === 'board' && (
          <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              {selectedProject ? (
                <>
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: selectedProject.color }}
                  />
                  <h1 className="text-lg font-semibold">{selectedProject.name}</h1>
                  {selectedProject.description && (
                    <span className="text-sm text-slate-500 hidden md:block">
                      — {selectedProject.description}
                    </span>
                  )}
                </>
              ) : (
                <h1 className="text-lg font-semibold">All Tasks</h1>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-1">
                <button
                  onClick={() => setBoardViewMode('list')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-sm transition-colors ${
                    boardViewMode === 'list' 
                      ? 'bg-slate-800 text-slate-100' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <List className="h-4 w-4" />
                  List
                </button>
                <button
                  onClick={() => setBoardViewMode('kanban')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-sm transition-colors ${
                    boardViewMode === 'kanban' 
                      ? 'bg-slate-800 text-slate-100' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Board
                </button>
              </div>
              
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
              >
                Search...
                <kbd className="text-xs bg-slate-800 px-1.5 py-0.5 rounded">/</kbd>
              </button>
            </div>
          </header>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {view === 'board' && (
            boardViewMode === 'list' 
              ? <TaskList projectId={selectedProjectId} />
              : <KanbanBoard />
          )}
          {view === 'today' && <TodayView />}
          {view === 'goals' && <GoalsView />}
        </div>
      </div>

      <QuickCapture />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </main>
  );
}
