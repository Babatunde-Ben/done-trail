import React from "react";
import { Box, Text, VStack, HStack, Badge } from "@chakra-ui/react";
import { Task, Project, TaskStatus } from "@/types";
import TaskBox from "./TaskBox";

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  projects: Project[];
  onTaskEdit: (task: Task) => void;
};

const KanbanColumn = ({
  status,
  tasks,
  projects,
  onTaskEdit,
}: KanbanColumnProps) => {
  const bgColor = "gray.50";
  const borderColor = "gray.200";

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "gray";
      case "IN_PROGRESS":
        return "blue";
      case "IN_REVIEW":
        return "purple";
      case "DONE":
        return "green";
      default:
        return "gray";
    }
  };

  const getProjectById = (projectId: string) => {
    return (
      projects.find((p) => p.id === projectId) || {
        id: projectId,
        name: "Unknown Project",
        createdAt: new Date(),
      }
    );
  };

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      minH="600px"
      w="300px"
    >
      <VStack gap={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="semibold" textTransform="capitalize">
            {status.replace("_", " ")}
          </Text>
          <Badge colorScheme={getStatusColor(status)} size="lg">
            {tasks.length}
          </Badge>
        </HStack>

        <VStack gap={3} align="stretch" flex="1">
          {tasks.length === 0 ? (
            <Box textAlign="center" py={8} color="gray.500" fontSize="sm">
              No tasks in this column
            </Box>
          ) : (
            tasks.map((task) => (
              <TaskBox
                key={task.id}
                task={task}
                project={getProjectById(task.projectId)}
                onEdit={onTaskEdit}
              />
            ))
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default KanbanColumn;
