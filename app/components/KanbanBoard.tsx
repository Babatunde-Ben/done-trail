"use client";
import React, { useState, useMemo } from "react";
import { Box, HStack, VStack, useDisclosure } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Task, TaskStatus } from "@/types";
import KanbanColumn from "@/app/components/KanbanColumn";
import TaskForm from "@/app/components/TaskForm";
import KanbanFilter from "@/app/components/KanbanFilter";

import { useTasksContext } from "@/app/context/TasksContext";

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

  // tasks from context
  const { tasks, setTasks, createTask, updateTask } = useTasksContext();

  const handleCreateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    createTask(taskData);
  };

  const handleUpdateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!editingTask) return;
    updateTask(taskData, editingTask.id);
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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a valid drop zone
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    // Get tasks for source and destination columns
    const sourceTasks = getTasksByStatus(sourceStatus);
    const destinationTasks = getTasksByStatus(destinationStatus);

    // Find the task being moved
    const task = sourceTasks.find((t) => t.id === draggableId);
    if (!task) {
      return;
    }

    // If moving within the same column
    if (sourceStatus === destinationStatus) {
      const newTasks = Array.from(sourceTasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      // Update all tasks in this column with new order
      setTasks((prevTasks) => {
        const otherTasks = prevTasks.filter((t) => t.status !== sourceStatus);
        return [...otherTasks, ...newTasks];
      });
    } else {
      // Moving to a different column
      const newTask = {
        ...task,
        status: destinationStatus,
        updatedAt: new Date(),
      };

      // Remove from source column
      const newSourceTasks = Array.from(sourceTasks);
      newSourceTasks.splice(source.index, 1);

      // Add to destination column at the specified position
      const newDestinationTasks = Array.from(destinationTasks);
      newDestinationTasks.splice(destination.index, 0, newTask);

      // Update all tasks
      setTasks((prevTasks) => {
        const otherTasks = prevTasks.filter(
          (t) => t.status !== sourceStatus && t.status !== destinationStatus
        );
        return [...otherTasks, ...newSourceTasks, ...newDestinationTasks];
      });
    }
  };

  const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

  return (
    <Box as={"main"} minH={"85vh"} p={{ base: 4, sm: 6, md: 8, lg: 10 }}>
      <VStack gap={6} align="stretch">
        <KanbanFilter onFilter={handleFilterChange} onOpen={onOpen} />

        <TaskForm
          open={open}
          onClose={handleClose}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask || undefined}
          mode={editingTask ? "edit" : "create"}
        />
        <DragDropContext onDragEnd={handleDragEnd}>
          <HStack gap={4} align="start" overflowX="auto" pb={4}>
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={getTasksByStatus(status)}
                onTaskEdit={handleTaskEdit}
              />
            ))}
          </HStack>
        </DragDropContext>
      </VStack>
    </Box>
  );
};

export default KanbanBoard;
