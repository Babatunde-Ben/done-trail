import React from "react";
import { Box, Text, VStack, HStack, Badge, Heading } from "@chakra-ui/react";
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
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "gray.50";
      case "IN_PROGRESS":
        return "blue.50";
      case "IN_REVIEW":
        return "purple.50";
      case "DONE":
        return "green.50";
      default:
        return "gray.50";
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
      bgColor={getStatusColor(status)}
      borderWidth="1px"
      borderColor={"gray.100"}
      borderRadius="lg"
      p={2}
      minH="600px"
      minW="270px"
      w="100%"
    >
      <VStack gap={4} align="stretch">
        <Heading
          fontSize="md"
          fontWeight="semibold"
          textTransform="capitalize"
          textAlign="center"
        >
          {status.replace("_", " ")}
        </Heading>

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
