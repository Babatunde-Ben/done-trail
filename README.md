# Kanban Board Application

A modern, responsive Kanban board application built with Next.js and Chakra UI for managing projects and tasks.

## Features

- **Project Management**: Create and manage multiple projects
- **Task Management**: Create, edit, and organize tasks across different statuses
- **Four Status Columns**: TODO, IN_PROGRESS, IN_REVIEW, DONE
- **Rich Task Information**: Each task displays:
  - Project name
  - Task title
  - Priority level (LOW, MEDIUM, HIGH, URGENT)
  - Start date
  - Due date
  - Current status
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Chakra UI for a clean, professional look

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Create a Task**: Click the "Create New Task" button to add a new task
- **Edit a Task**: Click on any task card to edit its details
- **View Tasks**: Tasks are organized in columns based on their status
- **Track Progress**: Move tasks between columns as work progresses

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Library**: Chakra UI v3
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: React Icons

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Main page component
├── components/
│   ├── TaskBox.tsx         # Individual task card component
│   ├── TaskForm.tsx        # Task creation/editing form
│   ├── KanbanColumn.tsx    # Column component for each status
│   ├── KanbanBoard.tsx     # Main board component
│   └── ui/                 # Chakra UI provider components
├── types/
│   └── index.ts            # TypeScript type definitions
└── README.md
```

## Future Enhancements

- Drag and drop functionality for moving tasks between columns
- Task filtering and searching
- Project management features
- User authentication
- Data persistence with a backend API
- Real-time collaboration
