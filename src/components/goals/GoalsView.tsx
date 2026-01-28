'use client';

import { useState } from 'react';
import { Compass, Plus, Target, Trash2, CheckCircle2 } from 'lucide-react';
import { useHarperStore } from '@/lib/store';
import { LIFE_AREA_CONFIG, LifeArea, Goal, Milestone } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function GoalsView() {
  const { goals, addGoal, updateGoal, deleteGoal } = useHarperStore();
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalArea, setNewGoalArea] = useState<LifeArea>('business');
  const [newGoalDesc, setNewGoalDesc] = useState('');

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    addGoal(newGoalTitle.trim(), newGoalArea);
    setNewGoalTitle('');
    setNewGoalDesc('');
    setNewGoalOpen(false);
  };

  const handleAddMilestone = (goalId: string, title: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    
    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };
    
    updateGoal(goalId, {
      milestones: [...goal.milestones, newMilestone],
    });
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    
    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId
        ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date() : undefined }
        : m
    );
    
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100)
      : 0;
    
    updateGoal(goalId, {
      milestones: updatedMilestones,
      progress,
    });
  };

  const groupedGoals = Object.entries(LIFE_AREA_CONFIG).reduce((acc, [area, config]) => {
    acc[area as LifeArea] = goals.filter((g) => g.lifeArea === area);
    return acc;
  }, {} as Record<LifeArea, Goal[]>);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="h-6 w-6 text-violet-400" />
            Goals
          </h1>
          <p className="text-slate-400 mt-1">Long-term objectives across all areas of life</p>
        </div>
        
        <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle>New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="What do you want to achieve?"
                className="bg-slate-800 border-slate-700"
              />
              <Textarea
                value={newGoalDesc}
                onChange={(e) => setNewGoalDesc(e.target.value)}
                placeholder="Why is this important?"
                className="bg-slate-800 border-slate-700"
              />
              <Select value={newGoalArea} onValueChange={(v) => setNewGoalArea(v as LifeArea)}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LIFE_AREA_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.icon} {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setNewGoalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGoal}>Create Goal</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals by Area */}
      {Object.entries(groupedGoals).map(([area, areaGoals]) => {
        if (areaGoals.length === 0) return null;
        const config = LIFE_AREA_CONFIG[area as LifeArea];
        
        return (
          <div key={area} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
              <span>{config.icon}</span>
              {config.label}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {areaGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAddMilestone={(title) => handleAddMilestone(goal.id, title)}
                  onToggleMilestone={(mId) => handleToggleMilestone(goal.id, mId)}
                  onDelete={() => deleteGoal(goal.id)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {goals.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="py-12 text-center">
            <Compass className="h-12 w-12 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No goals yet</h3>
            <p className="text-slate-500 mb-4">
              Set meaningful goals to guide your focus and priorities
            </p>
            <Button onClick={() => setNewGoalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface GoalCardProps {
  goal: Goal;
  onAddMilestone: (title: string) => void;
  onToggleMilestone: (milestoneId: string) => void;
  onDelete: () => void;
}

function GoalCard({ goal, onAddMilestone, onToggleMilestone, onDelete }: GoalCardProps) {
  const [newMilestone, setNewMilestone] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;
    onAddMilestone(newMilestone.trim());
    setNewMilestone('');
    setShowAdd(false);
  };

  return (
    <Card className="bg-slate-900 border-slate-800 group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium text-slate-100">
            {goal.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-slate-500 hover:text-rose-400"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{goal.progress}%</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {/* Milestones */}
        {goal.milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="flex items-center gap-2 text-sm"
          >
            <button
              onClick={() => onToggleMilestone(milestone.id)}
              className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                milestone.completed
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              {milestone.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
            </button>
            <span className={milestone.completed ? 'text-slate-500 line-through' : 'text-slate-300'}>
              {milestone.title}
            </span>
          </div>
        ))}

        {/* Add milestone */}
        {showAdd ? (
          <form onSubmit={handleAddMilestone} className="flex gap-2">
            <Input
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="Milestone..."
              className="h-8 text-sm bg-slate-800 border-slate-700"
              autoFocus
            />
            <Button type="submit" size="sm" className="h-8">
              Add
            </Button>
          </form>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-500 hover:text-slate-300"
            onClick={() => setShowAdd(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add milestone
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
