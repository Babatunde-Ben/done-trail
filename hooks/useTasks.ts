import { useState, useEffect } from "react";
import { Task, Project } from "@/types";

const TASKS_STORAGE_KEY = "kanban-tasks";

// Default sample data for projects (state only)

// Default sample data for tasks (localStorage)
const defaultTasks: Task[] = [
  //   {
  //     id: "1",
  //     projectId: "1",
  //     title: "Design homepage layout",
  //     priority: "HIGH",
  //     status: "IN_REVIEW",
  //     dueDate: new Date("2024-03-15"),
  //     startDate: new Date("2024-03-01"),
  //     createdAt: new Date("2024-02-20"),
  //     updatedAt: new Date("2024-02-20"),
  //   },
  //   {
  //     id: "2",
  //     projectId: "1",
  //     title: "Implement responsive design",
  //     priority: "MEDIUM",
  //     status: "IN_PROGRESS",
  //     dueDate: new Date("2024-03-20"),
  //     startDate: new Date("2024-03-05"),
  //     createdAt: new Date("2024-02-22"),
  //     updatedAt: new Date("2024-02-22"),
  //   },
  //   {
  //     id: "3",
  //     projectId: "2",
  //     title: "User authentication",
  //     priority: "URGENT",
  //     status: "IN_REVIEW",
  //     dueDate: new Date("2024-03-10"),
  //     startDate: new Date("2024-02-25"),
  //     createdAt: new Date("2024-02-25"),
  //     updatedAt: new Date("2024-02-25"),
  //   },
  //   {
  //     id: "4",
  //     projectId: "3",
  //     title: "API documentation",
  //     priority: "LOW",
  //     status: "DONE",
  //     dueDate: new Date("2024-02-28"),
  //     startDate: new Date("2024-02-15"),
  //     createdAt: new Date("2024-02-15"),
  //     updatedAt: new Date("2024-02-28"),
  //   },
];

// Helper functions for task localStorage only
const loadTasksFromStorage = (): Task[] => {
  if (typeof window === "undefined") return defaultTasks;

  try {
    const item = localStorage.getItem(TASKS_STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      // Convert date strings back to Date objects
      return parsed.map((item: Task) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
        startDate: item.startDate ? new Date(item.startDate) : undefined,
      }));
    }
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
  }

  return defaultTasks;
};

const saveTasksToStorage = (tasks: Task[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Self-Service Portal",
      description: "Complete redesign of company self-service portal",
      createdAt: new Date("2025-09-20"),
    },
    {
      id: "2",
      name: "Online Shopping Portal",
      description: "New online shopping portal development",
      createdAt: new Date("2025-09-24"),
    },
    {
      id: "3",
      name: "HRMS Portal",
      description: "New HRMS portal development",
      createdAt: new Date("2025-09-27"),
    },
  ]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = loadTasksFromStorage();
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasksToStorage(tasks);
    }
  }, [tasks]);

  const createTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
    taskId: string
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...taskData,
              id: taskId,
              createdAt: task.createdAt,
              updatedAt: new Date(),
            }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return {
    tasks,
    projects,
    setTasks,
    setProjects,
    createTask,
    updateTask,
    deleteTask,
  };
};
