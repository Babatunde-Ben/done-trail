import React from "react";
import { Box, VStack, Heading, Separator } from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import { Task, TaskStatus } from "@/types";
import TaskBox from "./TaskBox";
import { projects } from "@/app/utils/constant";

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
};

const KanbanColumn = ({ status, tasks, onTaskEdit }: KanbanColumnProps) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "gray.500";
      case "IN_PROGRESS":
        return "blue.500";
      case "IN_REVIEW":
        return "purple.500";
      case "DONE":
        return "green.500";
      default:
        return "gray.500";
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
      bgColor={"gray.50"}
      border={"1px solid"}
      borderTop={"3px solid"}
      borderRadius="lg"
      borderColor={"gray.200"}
      borderTopColor={getStatusColor(status)}
      p={2}
      minH="600px"
      minW="270px"
      w="100%"
      // width="500px"
      // w={{ base: "270px", sm: "500px" }}
    >
      <VStack gap={4} align="stretch" minH="600px">
        <Heading
          fontSize="md"
          fontWeight="semibold"
          textTransform="capitalize"
          textAlign="center"
          color={getStatusColor(status)}
        >
          {status.replace("_", " ")}
        </Heading>
        <Separator />

        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <VStack
              gap={3}
              align="stretch"
              flex="1"
              ref={provided.innerRef}
              {...provided.droppableProps}
              bg={snapshot.isDraggingOver ? "gray.100" : "transparent"}
              borderRadius="md"
            >
              {tasks.length === 0 ? (
                <Box textAlign="center" py={8} color="gray.500" fontSize="sm">
                  {snapshot.isDraggingOver
                    ? "Drop task here"
                    : "No tasks in this column"}
                </Box>
              ) : (
                tasks.map((task, index) => (
                  <TaskBox
                    key={task.id}
                    task={task}
                    project={getProjectById(task.projectId)}
                    onEdit={onTaskEdit}
                    index={index}
                  />
                ))
              )}
              {provided.placeholder}
            </VStack>
          )}
        </Droppable>
      </VStack>
    </Box>
  );
};

export default KanbanColumn;
