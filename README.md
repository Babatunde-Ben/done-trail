# DoneTrail (Kanban) Application

A modern, responsive Kanban board built with Next.js and Chakra UI. Manage tasks across projects with drag-and-drop, due-date filtering, and localStorage persistence.

## Features

- **Task Management**: Create and edit tasks with `react-hook-form`
- **Four Columns**: `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`
- **Drag & Drop**: Move tasks within/between columns with `@hello-pangea/dnd`
- **Persistence**: Tasks saved to `localStorage` (create/read/update/delete)
- **Global State**: `TasksContext` provides tasks and actions (no prop drilling)
- **Due-Date Range Filter**: Filter by due date (From/To) only, plus search, project, priority
- **Responsive Filters**: Filter bar wraps on small screens and adapts widths
- **Toasts**: Success/info/warning toasts on create/update/delete
- **Task Card Details**: Project name, title, priority, start date, due date

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: LTS)
- npm 9+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production build

```bash
npm run build
npm start
```

### Scripts

- `npm run dev` – start Next.js in development (Turbopack)
- `npm run build` – build for production (Turbopack)
- `npm start` – run the production server
- `npm run lint` – run eslint

### Environment

No env vars are required. Tasks persist in browser `localStorage`.

## Usage

- **Create a Task**: Click "Add Task" to open the form
- **Edit a Task**: Click a task card (title area) to edit
- **Move Tasks**: Drag a task to a new position or column; order is preserved
- **Filter Tasks**:
  - Search by title
  - Filter by project and priority
  - Filter by due date range (From/To). Only `dueDate` is considered
- **Delete Task**: Use the card menu (⋮) → Delete

## Technology Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Chakra UI v3 (with `@chakra-ui/react` components)
- **Drag & Drop**: `@hello-pangea/dnd`
- **Forms**: `react-hook-form`
- **Icons**: `react-icons`

## Project Structure

```
├── app/
│   ├── components/
│   │   ├── KanbanBoard.tsx      # Main board (filters, DnD, modal)
│   │   ├── KanbanColumn.tsx     # Column wrapper with Droppable
│   │   ├── KanbanFilter.tsx     # Responsive filter bar (due-date range)
│   │   ├── TaskBox.tsx          # Task card (Draggable)
│   │   ├── TaskForm.tsx         # Create/update form (react-hook-form)
│   │   └── ui/
│   │       ├── provider.tsx     # Chakra Provider wrapper
│   │       ├── toaster.tsx      # Toaster + `toaster.create`
│   │       └── tooltip.tsx      # Tooltip wrapper
│   ├── context/TasksContext.tsx # Global tasks context provider
│   ├── hooks/useTasks.ts        # Tasks + localStorage (CRUD + toasts)
│   ├── utils/constant.ts        # Static `projects`, `priorities`
│   ├── layout.tsx               # Root layout (Providers + Toaster)
│   └── page.tsx                 # Entry page
├── types/index.ts               # `Task`, `TaskStatus`, `TaskPriority`, `FilterState`
└── README.md
```

## State & Data

- **Tasks**: Stored in localStorage via `useTasks` (create/update/delete persist)
- **Projects**: Provided as static seed data (`app/utils/constant.ts`); not persisted
- **Context**: `TasksProvider` exposes `{ tasks, setTasks, createTask, updateTask, deleteTask }`
- **Toasts**: `toaster.create({ title, description, type, duration })` used in CRUD

## Filtering

- Search by title (case-insensitive)
- Project and priority filters
- Due-date range (From/To) filters only by `task.dueDate`
- Responsive filter bar: inputs wrap and resize on small screens
