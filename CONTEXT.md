# Harper OS - Active Context

**Last Updated:** 2026-01-30 05:30 PST

## Current Status
- ✅ Supabase wired up and working
- ✅ Schema deployed (businesses, projects, tasks, goals, daily_focus, documents, etc.)
- ✅ List/Board view toggle added
- ✅ Add Project button in sidebar
- ✅ Pushed to GitHub, Vercel deploying
- ✅ "Ideas" kanban column added (💡 before Backlog)
- ✅ Documents library seeded with 5 real plans/analyses

## Supabase Credentials
- **Project URL:** https://odjqikyekktqlnrarupg.supabase.co
- **Already in:** `.env.local` and Vercel env vars

## Recent Changes (Jan 30)
1. Added `'idea'` status to `TaskStatus` type and `STATUS_COLUMNS` in `src/lib/types.ts`
2. Updated `DbTask` status type in `src/lib/supabase.ts` to include `'idea'`
3. Added `task_status` enum value `'idea'` BEFORE `'backlog'` in Supabase DB
4. Updated `supabase/schema.sql` with `'idea'` in tasks status check + full documents table
5. Added migration `supabase/migrations/002_add_idea_status.sql`
6. Seeded 2 idea tasks: "Grok Imagine API Integration" + "Content Reformatting Pipeline"
7. Seeded 5 documents into documents library (strategies + analyses for Swim & Mortgage)
8. Added `scripts/seed-documents.mjs` for document seeding

## Recent Changes (Jan 28)
1. Created `src/lib/supabase.ts` - Supabase client
2. Created `src/lib/db.ts` - Database operations layer
3. Updated `src/lib/store.ts` - Zustand store now syncs with Supabase
4. Added `src/components/kanban/TaskList.tsx` - List view for tasks
5. Added `src/components/ui/checkbox.tsx` - Checkbox component
6. Updated sidebar with "Add Project" button per business

## Tech Stack
- Next.js 16.1.6 (Turbopack)
- Supabase (PostgreSQL)
- Zustand + localStorage cache
- Tailwind CSS v4 + shadcn/ui

## What's Next
- [ ] Test Vercel deployment with Ideas column
- [ ] Build Documents UI (viewer, list, search)
- [ ] Test drag-and-drop sync

---

*This file helps me maintain context across sessions. Updated during active work.*
