# Harper OS - Design Document

## Vision
A personal operating system for Zach to manage projects, tasks, and daily priorities across Inspired Swim, Inspired Mortgage, and personal endeavors. Built for calm efficiency over hustle culture.

## Core Philosophy
- **Peace over panic** - Surface what matters, hide what doesn't
- **Daily focus** - What moves the needle today?
- **Context that persists** - Integration with Harper's memory system
- **Mobile-first** - Zach is often on the go

## Features

### v1 - MVP
1. **Project Kanban**
   - Projects: Inspired Swim, Inspired Mortgage, Personal, Holly, Nata, etc.
   - Status columns: Backlog, This Week, Today, In Progress, Done
   - Drag-and-drop reordering

2. **Task Management**
   - Tasks belong to projects
   - Priority levels: Critical, High, Normal, Low
   - Due dates and deadlines
   - Quick capture from anywhere

3. **Daily View**
   - Today's priorities at a glance
   - Calendar integration (Google Calendar)
   - Morning briefing summary

4. **Harper Integration**
   - Notes/context field on tasks that syncs to memory files
   - Harper can query project status
   - Links to repos, Vercel, docs

### v2 - Future
- Calendar sync and scheduling
- Time tracking
- Recurring tasks
- Team collaboration (Cheri, Greg, etc.)
- Mobile app (React Native or PWA)

## Tech Stack
- **Frontend**: Next.js 15 + App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth (Google OAuth)
- **Deployment**: Vercel

## Database Schema

### projects
- id (uuid, pk)
- name (text)
- description (text)
- color (text) - for visual distinction
- order (int) - for sorting
- archived (bool)
- created_at (timestamp)
- updated_at (timestamp)

### tasks
- id (uuid, pk)
- project_id (uuid, fk)
- title (text)
- description (text)
- status (enum: backlog, this_week, today, in_progress, done)
- priority (enum: critical, high, normal, low)
- due_date (date)
- order (int) - within status column
- notes (text) - rich context, syncs to Harper's memory
- links (jsonb) - array of {type, url, label}
- created_at (timestamp)
- updated_at (timestamp)
- completed_at (timestamp)

### daily_focus
- id (uuid, pk)
- date (date, unique)
- priorities (jsonb) - ordered list of task_ids
- notes (text) - morning briefing notes
- created_at (timestamp)
- updated_at (timestamp)

## UI Components

### Layout
```
+----------------------------------+
|  Harper OS              [User]  |
+----------------------------------+
|  [Projects] [Today] [Calendar]  |
+----------------------------------+
|                                  |
|  Main Content Area               |
|                                  |
+----------------------------------+
```

### Kanban Board
```
+----------+----------+----------+----------+----------+
| Backlog  | This Week|  Today   |In Progress|  Done   |
+----------+----------+----------+----------+----------+
| [Task]   | [Task]   | [Task]   | [Task]   | [Task]  |
| [Task]   | [Task]   |          |          | [Task]  |
| [Task]   |          |          |          |         |
+----------+----------+----------+----------+----------+
```

## API Routes

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Archive project

- `GET /api/tasks` - List tasks (filterable by project, status)
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task (incl. status changes)
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/move` - Reorder within column

- `GET /api/daily/:date` - Get daily focus
- `PUT /api/daily/:date` - Set daily focus

## Color Palette (matches Harper's calm efficiency vibe)
- Background: slate-950 (#020617)
- Surface: slate-900 (#0f172a)
- Border: slate-800 (#1e293b)
- Text: slate-100 (#f1f5f9)
- Accent: blue-500 (#3b82f6)
- Success: emerald-500 (#10b981)
- Warning: amber-500 (#f59e0b)
- Critical: rose-500 (#f43f5e)
