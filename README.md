# Microsoft To-Do with Next.js

A modern task management application inspired by Microsoft To-Do, rebuilt with Next.js 16 and React 19.

[中文](./README.zh-CN.md)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)
![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-f43f5e?logo=auth0)

## ✨ Features

- 📋 **Smart Lists** - My Day, Important, Planned, Inbox
- 🎨 **Custom Sets** - Create personalized task categories with emojis
- ✅ **Subtasks** - Break down tasks into manageable steps
- 🌙 **Dark Mode** - Built-in theme support
- 🔐 **OAuth Auth** - GitHub & Google sign-in
- 💾 **Auto-save** - Local persistence with Zustand
- 📊 **Smart Settings** - Configure list visibility preferences

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun
- SQLite (development) or PostgreSQL (production)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd microsoft-todo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npm run db:gen

# Run database migrations
npm run db:md

# Start development server
# Clone the repository
git clone <repository-url>
cd microsoft-todo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npm run db:gen

# Run database migrations
npm run db:md

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State Management:** Zustand with persistence
- **Drag & Drop:** @dnd-kit/core

### Backend

- **Database ORM:** Prisma
- **Authentication:** Better Auth
- **Database:** SQLite (dev) / PostgreSQL (prod)

### Key Libraries

| Library           | Purpose                |
| ----------------- | ---------------------- |
| `lucide-react`    | Icon library           |
| `react-hook-form` | Form handling          |
| `zod`             | Schema validation      |
| `sonner`          | Toast notifications    |
| `@radix-ui`       | Headless UI components |

## 📁 Project Structure

```
microsoft-todo/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── auth/[...all]/        # Better Auth handler
│   │   ├── todos/                # Todo CRUD endpoints
│   │   └── user/[id]/            # User endpoints
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── profile/[userid]/         # User profile
│   └── todo/                     # Todo app pages
│       ├── tasks/[setId]/        # Task list view
│       └── setting/              # Settings page
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   └── ...                       # Other components
├── lib/                          # Utilities & actions
│   ├── actions/                  # Server actions
│   │   ├── todo/                 # Todo actions
│   │   └── user/                 # User actions
│   ├── auth.ts                   # Auth configuration
│   ├── auth-client.ts            # Client auth hooks
│   └── prisma.ts                 # Database client
├── store/                        # Zustand store
│   ├── index.ts                  # Store exports
│   └── todo-app.ts               # Main store
├── prisma/                       # Database schema
│   └── schema.prisma
└── generated/                    # Generated Prisma client
```

## 📝 Available Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Start development server with Turbopack |
| `npm run build`     | Build for production                    |
| `npm run start`     | Start production server                 |
| `npm run lint`      | Run ESLint                              |
| `npm run db:gen`    | Generate Prisma client                  |
| `npm run db:md`     | Create and apply migration              |
| `npm run db:mr`     | Reset database (drops all data)         |
| `npm run db:studio` | Open Prisma Studio GUI                  |
| `npm run db:format` | Format Prisma schema                    |

## 🔧 Environment Variables

| Variable               | Description                | Default                 |
| ---------------------- | -------------------------- | ----------------------- |
| `DATABASE_URL`         | Database connection string | `file:./dev.db`         |
| `BETTER_AUTH_URL`      | Auth base URL              | `http://localhost:3000` |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID     | -                       |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret        | -                       |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID     | -                       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret        | -                       |

## 📦 Database Schema

| Model          | Description                    |
| -------------- | ------------------------------ |
| `user`         | User accounts                  |
| `account`      | OAuth provider accounts        |
| `session`      | User sessions                  |
| `todoSet`      | Task categories (custom lists) |
| `todoTask`     | Tasks                          |
| `todoTaskStep` | Subtasks                       |
| `verification` | Email verification tokens      |

## 🎨 Default Smart Lists

The app comes with 6 built-in smart lists:

| ID               | Label          | Icon |
| ---------------- | -------------- | ---- |
| `myday`          | My Day         | ☀️   |
| `important`      | Important      | ⭐   |
| `planned`        | Planned        | 📋   |
| `assigned_to_me` | Assigned to Me | 👤   |
| `flagged`        | Flagged Emails | 🚩   |
| `inbox`          | Tasks          | 🏠   |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Microsoft To-Do](https://todo.microsoft.com/) - Design inspiration
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Better Auth](https://better-auth.com/) - Authentication

<p align="center">Made with ❤️ by the community</p>
