-- Migration: Add 'needs_review' status to tasks
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/odjqikyekktqlnrarupg/sql

-- Drop the old constraint and add the updated one
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
  CHECK (status IN ('backlog', 'this_week', 'today', 'in_progress', 'needs_review', 'done'));
