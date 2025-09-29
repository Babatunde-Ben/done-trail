import { Project, TaskPriority } from "@/types";

export const projects: Project[] = [
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
];

export const priorities: { value: TaskPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];
