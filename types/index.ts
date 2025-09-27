export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  startDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
