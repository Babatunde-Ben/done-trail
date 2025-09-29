import { useState, useEffect } from "react";
import { Task, Project } from "@/types";

const TASKS_STORAGE_KEY = "kanban-tasks";

// Helper functions for task localStorage only
const loadTasksFromStorage = (): Task[] => {
  if (typeof window === "undefined") return [];

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

  return [];
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

  // Load tasks from localStorage on page mount
  useEffect(() => {
    const savedTasks = loadTasksFromStorage();
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    console.log("updated tasks", tasks);
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
    console.log("deleting task", taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return {
    tasks,
    setTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
