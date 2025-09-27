"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Task, Project, TaskStatus } from "@/types";
import KanbanColumn from "@/components/KanbanColumn";
import TaskForm from "@/components/TaskForm";
import KanbanFilter from "@/components/KanbanFilter";

const KanbanBoard = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Sample data - in a real app, this would come from an API or state management
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete redesign of company website",
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      name: "Mobile App",
      description: "New mobile application development",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "3",
      name: "API Integration",
      description: "Third-party API integration project",
      createdAt: new Date("2024-02-01"),
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      projectId: "1",
      title: "Design homepage layout",
      description: "Create wireframes and mockups for the new homepage",
      priority: "HIGH",
      status: "TODO",
      dueDate: new Date("2024-03-15"),
      startDate: new Date("2024-03-01"),
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-02-20"),
    },
    {
      id: "2",
      projectId: "1",
      title: "Implement responsive design",
      description: "Make the design work on all device sizes",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      dueDate: new Date("2024-03-20"),
      startDate: new Date("2024-03-05"),
      createdAt: new Date("2024-02-22"),
      updatedAt: new Date("2024-02-22"),
    },
    {
      id: "3",
      projectId: "2",
      title: "User authentication",
      description: "Implement login and registration functionality",
      priority: "URGENT",
      status: "IN_REVIEW",
      dueDate: new Date("2024-03-10"),
      startDate: new Date("2024-02-25"),
      createdAt: new Date("2024-02-25"),
      updatedAt: new Date("2024-02-25"),
    },
    {
      id: "4",
      projectId: "3",
      title: "API documentation",
      description: "Write comprehensive API documentation",
      priority: "LOW",
      status: "DONE",
      dueDate: new Date("2024-02-28"),
      startDate: new Date("2024-02-15"),
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-02-28"),
    },
  ]);

  const handleCreateTask = (
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

  const handleEditTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!editingTask) return;

    const updatedTask: Task = {
      ...taskData,
      id: editingTask.id,
      createdAt: editingTask.createdAt,
      updatedAt: new Date(),
    };

    setTasks((prev) =>
      prev.map((task) => (task.id === editingTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    onOpen();
  };

  const handleClose = () => {
    onClose();
    setEditingTask(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

  return (
    <Box p={6}>
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            Kanban Board
          </Text>
          <Button colorScheme="blue" onClick={onOpen}>
            Create New Task
          </Button>
        </HStack>
        <KanbanFilter />
        <HStack gap={4} align="start" overflowX="auto" pb={4}>
          {statuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
              projects={projects}
              onTaskEdit={handleTaskEdit}
            />
          ))}
        </HStack>
      </VStack>

      {/* <TaskForm
        isOpen={open}
        onClose={handleClose}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        projects={projects}
        initialData={editingTask || undefined}
        mode={editingTask ? "edit" : "create"}
      /> */}
    </Box>
  );
};

export default KanbanBoard;
