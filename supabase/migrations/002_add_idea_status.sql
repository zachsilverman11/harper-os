-- Add 'idea' status to task_status enum type
ALTER TYPE task_status ADD VALUE 'idea' BEFORE 'backlog';
