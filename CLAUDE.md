# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Microsoft To-Do clone built with Next.js 16, featuring task management with custom sets, substeps, and OAuth authentication.

## Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack

# Build & Production
npm run build            # Build for production
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint

# Database (Prisma)
npm run db:gen           # Generate Prisma client
npm run db:md            # Create and apply migration (dev)
npm run db:mr            # Reset database (drops all data)
npm run db:studio        # Open Prisma Studio GUI
npm run db:format        # Format schema.prisma
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style)
- **Database**: Prisma ORM - SQLite (dev) / PostgreSQL (prod)
- **Auth**: Better Auth with GitHub & Google OAuth
- **State**: Zustand with persistence and devtools

### Key Patterns

**Authentication Flow**
- `lib/auth.ts` - Server-side Better Auth configuration
- `lib/auth-client.ts` - Client-side auth hooks (`useSession`, `signOut`, social sign-in)
- `components/session-provider.tsx` - Syncs session to Zustand store

**Database Layer**
- `lib/prisma.ts` - Singleton PrismaClient with adapter selection based on `DATABASE_URL`
- Generated client at `generated/prisma/client` (not default `node_modules/.prisma`)

**Server Actions** (`lib/actions/`)
- All database mutations use `"use server"` directives
- Actions return `ActionResponse<T>` type with `{ success, message, data }`
- Organized by domain: `todo/`, `user/`

**State Management** (`store/todo-app.ts`)
- Zustand store with `persist` middleware (localStorage)
- Selector hooks: `useGetTasks()`, `useGetSets()`, `useGetTaskById(id)`
- Actions: `fetchInitialData()`, `addTask()`, `updateTask()`, etc.

**Todo Structure**
- Default sets defined in `app/todo/config.tsx` (myday, important, planned, etc.)
- Custom user sets stored in database (`TodoSet` model)
- Tasks can belong to a set or be standalone (`setId` is optional)

### Route Structure
```
app/
├── api/auth/[...all]/route.ts    # Better Auth handler
├── api/todos/                     # Todo CRUD endpoints
├── api/user/[id]/                 # User endpoints
├── login/                         # Login page
├── register/                      # Registration page
├── profile/[userid]/              # User profile
└── todo/
    ├── page.tsx                   # Redirects to /todo/tasks/myday
    ├── tasks/[setId]/page.tsx     # Task list view
    └── setting/page.tsx           # Todo settings
```

### Environment Variables
Required for full functionality:
- `DATABASE_URL` - SQLite file path or PostgreSQL connection string
- `BETTER_AUTH_URL` - Base URL for auth (defaults to localhost:3000)
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth