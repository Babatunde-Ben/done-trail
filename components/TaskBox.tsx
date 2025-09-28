import React from "react";
import { Text, Badge, HStack, Card } from "@chakra-ui/react";
import { Task, Project, TaskPriority } from "@/types";

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
    <Card.Root
      bg={"white"}
      borderColor={"gray.200"}
      borderRadius="md"
      cursor="pointer"
      _hover={{ shadow: "sm" }}
      onClick={() => onEdit?.(task)}
      minH="120px"
    >
      <Card.Title
        bgColor={"gray.100"}
        fontSize={"sm"}
        fontWeight={"semibold"}
        p={2}
        color={"gray.700"}
        textOverflow={"ellipsis"}
        textAlign={"center"}
      >
        {task.title}
      </Card.Title>
      <Card.Body p={2} spaceY={2} bgColor={"white"}>
        <HStack align="center" fontSize="sm">
          <Text fontWeight={"semibold"}>Project:</Text>
          <Text color={"gray.500"}>{project.name}</Text>
        </HStack>
        <HStack align="center" fontSize="sm">
          <Text fontWeight={"semibold"}>Priority:</Text>
          <Badge colorPalette={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </HStack>
        <HStack fontSize="sm">
          <Text fontWeight={"semibold"}>Due Date:</Text>
          <Text
            color={
              task.dueDate && new Date(task.dueDate) < new Date()
                ? "red.500"
                : "gray.500"
            }
          >
            {formatDate(task.dueDate)}
          </Text>
        </HStack>{" "}
        <HStack fontSize="sm">
          <Text fontWeight={"semibold"}>Start Date:</Text>
          <Text color={"gray.500"}>{formatDate(task.startDate)}</Text>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};

export default TaskBox;
