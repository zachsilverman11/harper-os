# Harper OS - Active Context

**Last Updated:** 2026-01-28 13:08 PST

## Current Status
- ✅ Supabase wired up and working
- ✅ Schema deployed (businesses, projects, tasks, goals, daily_focus, etc.)
- ✅ List/Board view toggle added
- ✅ Add Project button in sidebar
- ✅ Pushed to GitHub, Vercel deploying

## Supabase Credentials
- **Project URL:** https://odjqikyekktqlnrarupg.supabase.co
- **Already in:** `.env.local` and Vercel env vars

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
- [ ] Test Vercel deployment
- [ ] Add some sample tasks
- [ ] Test drag-and-drop sync

---

*This file helps me maintain context across sessions. Updated during active work.*
