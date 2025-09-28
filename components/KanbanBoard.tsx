"use client";
import React, { useState, useMemo } from "react";
import { Box, HStack, VStack, Text, useDisclosure } from "@chakra-ui/react";
import { Task, Project, TaskStatus } from "@/types";
import KanbanColumn from "@/components/KanbanColumn";
import TaskForm from "@/components/TaskForm";
import KanbanFilter from "@/components/KanbanFilter";

type FilterState = {
  search: string;
  projectId: string;
  priority: string;
  startDate: string;
  endDate: string;
};

const KanbanBoard = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    projectId: "",
    priority: "",
    startDate: "",
    endDate: "",
  });

  // Sample data - in a real app, this would come from an API or state management
  const [projects] = useState<Project[]>([
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

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      projectId: "1",
      title: "Design homepage layout",
      priority: "HIGH",
      status: "IN_REVIEW",
      dueDate: new Date("2024-03-15"),
      startDate: new Date("2024-03-01"),
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-02-20"),
    },
    {
      id: "2",
      projectId: "1",
      title: "Implement responsive design",
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
      priority: "LOW",
      status: "DONE",
      dueDate: new Date("2024-02-28"),
      startDate: new Date("2024-02-15"),
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-02-28"),
    },
  ]);

  const createTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("create newTask", newTask);
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (
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

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (
        filters.search &&
        !task.title.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Project filter
      if (filters.projectId && task.projectId !== filters.projectId) {
        return false;
      }

      // Priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const taskStartDate = task.startDate ? new Date(task.startDate) : null;
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
        const filterStartDate = filters.startDate
          ? new Date(filters.startDate)
          : null;
        const filterEndDate = filters.endDate
          ? new Date(filters.endDate)
          : null;

        // Check if task falls within the date range
        let withinDateRange = true;

        if (filterStartDate && filterEndDate) {
          // Both start and end dates provided
          const startDateMatch = taskStartDate
            ? taskStartDate >= filterStartDate && taskStartDate <= filterEndDate
            : false;
          const dueDateMatch = taskDueDate
            ? taskDueDate >= filterStartDate && taskDueDate <= filterEndDate
            : false;
          withinDateRange = startDateMatch || dueDateMatch;
        } else if (filterStartDate) {
          // Only start date provided
          const startDateMatch = taskStartDate
            ? taskStartDate >= filterStartDate
            : false;
          const dueDateMatch = taskDueDate
            ? taskDueDate >= filterStartDate
            : false;
          withinDateRange = startDateMatch || dueDateMatch;
        } else if (filterEndDate) {
          // Only end date provided
          const startDateMatch = taskStartDate
            ? taskStartDate <= filterEndDate
            : false;
          const dueDateMatch = taskDueDate
            ? taskDueDate <= filterEndDate
            : false;
          withinDateRange = startDateMatch || dueDateMatch;
        }

        if (!withinDateRange) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

  return (
    <Box p={{ base: 4, sm: 6, md: 8, lg: 10 }}>
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            Kanban Board
          </Text>
        </HStack>
        <KanbanFilter
          onFilter={handleFilterChange}
          onOpen={onOpen}
          projects={projects}
        />

        <TaskForm
          open={open}
          onClose={handleClose}
          onSubmit={editingTask ? updateTask : createTask}
          projects={projects}
          initialData={editingTask || undefined}
          mode={editingTask ? "edit" : "create"}
        />
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
    </Box>
  );
};

export default KanbanBoard;
