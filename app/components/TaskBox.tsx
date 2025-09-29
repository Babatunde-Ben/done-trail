import React from "react";
import {
  Text,
  Badge,
  HStack,
  Card,
  Menu,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { Task, Project, TaskPriority } from "@/types";
import { LuInfo } from "react-icons/lu";
import { Tooltip } from "@/app/components/ui/tooltip";
import { HiDotsVertical, HiPencil, HiTrash } from "react-icons/hi";
import { useTasks } from "@/app/hooks/useTasks";

type TaskBoxProps = {
  task: Task;
  project: Project;
  onEdit?: (task: Task) => void;
  index: number;
};

const TaskBox = ({ task, project, onEdit, index }: TaskBoxProps) => {
  const { deleteTask } = useTasks();

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

  const isTaskOverdue =
    task.dueDate && new Date(task.dueDate).getTime() < new Date().getTime();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card.Root
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          bg={"white"}
          borderColor={snapshot.isDragging ? "blue.300" : "gray.200"}
          borderRadius="lg"
          cursor="grab"
          _hover={{ shadow: "xs" }}
          minH="120px"
          transform={snapshot.isDragging ? "rotate(5deg)" : "none"}
          boxShadow={snapshot.isDragging ? "lg" : "none"}
          overflow="hidden"
        >
          <Card.Title
            bgColor={"gray.50"}
            fontSize={"sm"}
            fontWeight={"semibold"}
            py={3}
            px={4}
            color={"gray.700"}
            textOverflow={"ellipsis"}
          >
            <HStack justifyContent="space-between" alignItems="center">
              {task.title}
              <Menu.Root>
                <Menu.Trigger asChild>
                  <IconButton
                    variant="plain"
                    size="xs"
                    color={"gray.500"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HiDotsVertical />
                  </IconButton>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item
                        value="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(task);
                        }}
                      >
                        <HiPencil />
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        value="delete"
                        color="red.500"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(task.id);
                        }}
                      >
                        <HiTrash />
                        Delete
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </HStack>
          </Card.Title>
          <Card.Body py={3} px={4} spaceY={2} bgColor={"white"}>
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
              <Text color={isTaskOverdue ? "red.500" : "gray.500"}>
                {formatDate(task.dueDate)}
              </Text>
              {isTaskOverdue && (
                <Tooltip content="This task is overdue">
                  <LuInfo color="inherit" fontSize="xl" />
                </Tooltip>
              )}
            </HStack>{" "}
            <HStack fontSize="sm">
              <Text fontWeight={"semibold"}>Start Date:</Text>
              <Text color={"gray.500"}>{formatDate(task.startDate)}</Text>
            </HStack>
          </Card.Body>
        </Card.Root>
      )}
    </Draggable>
  );
};

export default TaskBox;
