"use client";

import React, { createContext, useContext } from "react";
import { Task } from "@/types";
import { useTasks } from "@/app/hooks/useTasks";

type TasksContextValue = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  createTask: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">,
    taskId: string
  ) => void;
  deleteTask: (taskId: string) => void;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const { tasks, setTasks, createTask, updateTask, deleteTask } = useTasks();

  return (
    <TasksContext.Provider
      value={{ tasks, setTasks, createTask, updateTask, deleteTask }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = (): TasksContextValue => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
};
