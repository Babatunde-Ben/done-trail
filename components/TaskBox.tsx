import React from "react";
import { Box, Text, Badge, VStack, HStack, Separator } from "@chakra-ui/react";
import { Task, Project, TaskPriority } from "@/types";
import { TbSubtask } from "react-icons/tb";

type TaskBoxProps = {
  task: Task;
  project: Project;
  onEdit?: (task: Task) => void;
};

const TaskBox = ({ task, project, onEdit }: TaskBoxProps) => {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "URGENT":
        return "red";
      case "HIGH":
        return "orange";
      case "MEDIUM":
        return "yellow";
      case "LOW":
        return "green";
      default:
        return "gray";
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Box
      bg={"white"}
      border="5px"
      borderColor={"gray.200"}
      borderRadius="md"
      p={4}
      cursor="pointer"
      _hover={{ shadow: "md" }}
      onClick={() => onEdit?.(task)}
      minH="120px"
    >
      <VStack align="stretch" gap={3}></VStack>
      <Text
        fontSize="lg"
        fontWeight="semibold"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {task.title}
      </Text>
      <Separator />
      <HStack align="center" fontSize="sm">
        <Text color="gray.500">Project:</Text>
        <Text>{project.name}</Text>
      </HStack>
      <HStack align="center" fontSize="sm">
        <Text color="gray.500">Priority:</Text>
        <Badge colorScheme={getPriorityColor(task.priority)} size="sm">
          {task.priority}
        </Badge>
      </HStack>
      <HStack fontSize="sm">
        <Text color="gray.500">Due Date:</Text>
        <Text
          color={
            task.dueDate && new Date(task.dueDate) < new Date()
              ? "red.500"
              : "inherit"
          }
        >
          {formatDate(task.dueDate)}
        </Text>
      </HStack>{" "}
      <HStack fontSize="sm">
        <Text color="gray.500">Start Date:</Text>
        <Text>{formatDate(task.startDate)}</Text>
      </HStack>
    </Box>
  );
};

export default TaskBox;
