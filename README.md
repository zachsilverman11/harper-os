# Harper OS

Your personal operating system for managing projects, tasks, and priorities across all areas of life.

Built for **calm efficiency** over hustle culture. Surface what matters, hide what doesn't.

## Features

### ✅ Implemented

- **Kanban Board** - Drag-and-drop task management with 5 columns: Backlog → This Week → Today → In Progress → Done
- **Today View** - Focus on what matters today with daily priorities, notes, and progress tracking
- **Goals** - Track long-term objectives with milestones and progress visualization
- **Projects by Life Area** - Organize across Business, Personal, Health, Family, and Learning
- **Quick Capture** - Fast task entry with keyboard shortcut (`C`)
- **Search** - Find anything instantly with `/` or `Cmd+K`
- **Keyboard Shortcuts** - Power user navigation (`T` for Today, `B` for Board, `G` for Goals)
- **Team Delegation** - Assign tasks to team members (Cheri, Greg, Amanda, Kelly, Jakub, Harper)
- **Rich Task Details** - Due dates, time estimates, tags, links, and notes
- **Priority Levels** - Critical, High, Normal, Low with visual indicators
- **Persistent Storage** - LocalStorage for now, Supabase-ready

### 🚧 Coming Soon

- Supabase database integration
- Google Calendar sync
- Recurring tasks
- Mobile responsive improvements
- Harper AI integration (query project status)
- Morning briefing generator
- Weekly planning view
- Time tracking

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand with persistence
- **Drag & Drop**: dnd-kit
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `C` | Quick Capture (add task) |
| `/` or `Cmd+K` | Search |
| `T` | Go to Today |
| `B` | Go to Board |
| `G` | Go to Goals |
| `Esc` | Close modals |

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main app page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── kanban/           # Kanban board components
│   ├── today/            # Today view
│   ├── goals/            # Goals view
│   ├── sidebar/          # Navigation sidebar
│   ├── quick-capture/    # Quick task entry
│   ├── search/           # Search modal
│   └── ui/               # shadcn/ui components
└── lib/
    ├── types.ts          # TypeScript types
    ├── store.ts          # Zustand store
    └── utils.ts          # Utilities
```

## Environment Variables (for Supabase)

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Design Philosophy

- **Peace over panic** - Clean, calm interface that doesn't overwhelm
- **Daily focus** - What moves the needle today?
- **Context that persists** - Notes on tasks sync to Harper's memory
- **Mobile-first** - Works on any device (coming soon)

## License

Private - Inspired Swim / Inspired Mortgage

---

Built with ⚡ by Harper
