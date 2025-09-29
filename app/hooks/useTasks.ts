import { useState, useEffect } from "react";
import { Task } from "@/types";
import { toaster } from "@/app/components/ui/toaster";

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

    toaster.create({
      title: "Task Created",
      description: `"${taskData.title}" has been created successfully`,
      type: "success",
      duration: 3000,
    });
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

    toaster.create({
      title: "Task Updated",
      description: `"${taskData.title}" has been updated successfully`,
      type: "info",
      duration: 3000,
    });
  };

  const deleteTask = (taskId: string) => {
    // Get task title before deleting for toast message
    const taskToDelete = tasks.find((task) => task.id === taskId);
    const taskTitle = taskToDelete?.title || "Task";

    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    console.log("task has been deleted", taskToDelete);
    toaster.create({
      title: "Task Deleted",
      description: `"${taskTitle}" has been deleted successfully`,
      type: "warning",
      duration: 3000,
    });
  };

  return {
    tasks,
    setTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
