"use client";
import React, { useState, useMemo } from "react";
import { Box, HStack, VStack, useDisclosure } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { FilterState, Task, TaskStatus } from "@/types";
import KanbanColumn from "@/app/components/KanbanColumn";
import TaskForm from "@/app/components/TaskForm";
import KanbanFilter from "@/app/components/KanbanFilter";

import { useTasksContext } from "@/app/context/TasksContext";

const KanbanBoard = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    projectId: "",
    priority: "",
    dueDateFrom: "",
    dueDateTo: "",
  });

  // context for task management
  const { tasks, setTasks, createTask, updateTask } = useTasksContext();

  const handleCreateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    createTask(taskData);
  };

  // update task handler
  const handleUpdateTask = (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!editingTask) return;
    updateTask(taskData, editingTask.id);
    setEditingTask(null);
  };

  // task edit handler
  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    onOpen();
  };

  // close task form handler
  const handleClose = () => {
    onClose();
    setEditingTask(null);
  };

  // filter tasks based on current filters
  // use memo to memoize the filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // search filter
      if (
        filters.search &&
        !task.title.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // project filter
      if (filters.projectId && task.projectId !== filters.projectId) {
        return false;
      }

      // priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // due date range filter (only dueDate is considered)
      if (filters.dueDateFrom || filters.dueDateTo) {
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
        const fromDate = filters.dueDateFrom
          ? new Date(filters.dueDateFrom)
          : null;
        const toDate = filters.dueDateTo ? new Date(filters.dueDateTo) : null;

        if (!taskDueDate) {
          return false;
        }

        if (fromDate && toDate) {
          if (taskDueDate < fromDate || taskDueDate > toDate) return false;
        } else if (fromDate) {
          if (taskDueDate < fromDate) return false;
        } else if (toDate) {
          if (taskDueDate > toDate) return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  // get tasks by status
  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  // filter change handler
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const normalized: FilterState = {
      search: newFilters.search || "",
      projectId: newFilters.projectId || "",
      priority: newFilters.priority || "",
      dueDateFrom: newFilters.dueDateFrom ?? "",
      dueDateTo: newFilters.dueDateTo ?? "",
    };
    setFilters(normalized);
  };

  // task drag end handler
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // if dropped outside a valid drop zone
    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    // get tasks for source and destination columns
    const sourceTasks = getTasksByStatus(sourceStatus);
    const destinationTasks = getTasksByStatus(destinationStatus);

    // find the task being moved
    const task = sourceTasks.find((t) => t.id === draggableId);
    if (!task) {
      return;
    }

    // if moving within the same column
    if (sourceStatus === destinationStatus) {
      const newTasks = Array.from(sourceTasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      // update all tasks in this column with new order
      setTasks((prevTasks) => {
        const otherTasks = prevTasks.filter((t) => t.status !== sourceStatus);
        return [...otherTasks, ...newTasks];
      });
    } else {
      // moving to a different column
      const newTask = {
        ...task,
        status: destinationStatus,
        updatedAt: new Date(),
      };

      // remove from source column
      const newSourceTasks = Array.from(sourceTasks);
      newSourceTasks.splice(source.index, 1);

      // add to destination column at the specified position
      const newDestinationTasks = Array.from(destinationTasks);
      newDestinationTasks.splice(destination.index, 0, newTask);

      // update all tasks
      setTasks((prevTasks) => {
        const otherTasks = prevTasks.filter(
          (t) => t.status !== sourceStatus && t.status !== destinationStatus
        );
        return [...otherTasks, ...newSourceTasks, ...newDestinationTasks];
      });
    }
  };

  // task statuses
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
