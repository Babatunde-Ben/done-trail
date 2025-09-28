"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  Button,
  Portal,
  Input,
  CloseButton,
  NativeSelect,
  Grid,
  GridItem,
  Field,
} from "@chakra-ui/react";
import { Task, Project, TaskPriority, TaskStatus } from "@/types";
import { useForm } from "react-hook-form";

type TaskFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  projects: Project[];
  initialData?: Partial<Task>;
  mode: "create" | "edit";
};

interface FormValues {
  projectId: string;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  startDate: string;
}

const TaskForm = ({
  open,
  onSubmit,
  projects,
  initialData,
  mode,
  onClose,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      projectId: initialData?.projectId || "",
      title: initialData?.title || "",
      priority: initialData?.priority || "MEDIUM",
      dueDate: initialData?.dueDate
        ? new Date(initialData.dueDate).toISOString().split("T")[0]
        : "",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : "",
    },
  });

  const onSubmitForm = (data: FormValues) => {
    const taskData = {
      projectId: data.projectId,
      title: data.title.trim(),
      priority: data.priority,
      status:
        mode === "create"
          ? ("TODO" as TaskStatus)
          : initialData?.status || ("TODO" as TaskStatus),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
    };

    onSubmit(taskData);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Reset form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      reset({
        projectId: initialData.projectId || "",
        title: initialData.title || "",
        priority: initialData.priority || "MEDIUM",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : "",
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [initialData, reset]);

  return (
    <Dialog.Root
      placement={"center"}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      open={open}
      onOpenChange={handleClose}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {mode === "create" ? "Create Task" : "Update Task"}
              </Dialog.Title>
            </Dialog.Header>
            <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
              <Dialog.Body>
                <Grid gap={4} templateColumns="repeat(2, 1fr)">
                  <GridItem colSpan={2}>
                    <Field.Root required invalid={!!errors.title}>
                      <Field.Label>
                        Title <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        {...register("title", {
                          required: "Title is required",
                          minLength: {
                            value: 3,
                            message: "Title must be at least 3 characters",
                          },
                        })}
                        placeholder="Enter task title"
                      />
                      <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                    </Field.Root>
                  </GridItem>

                  <GridItem>
                    <Field.Root required invalid={!!errors.projectId}>
                      <Field.Label>
                        Project
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          {...register("projectId", {
                            required: "Please select a project",
                          })}
                          placeholder="Select project"
                        >
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      <Field.ErrorText>
                        {errors.projectId?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </GridItem>

                  <GridItem>
                    <Field.Root required invalid={!!errors.priority}>
                      <Field.Label>
                        Priority <Field.RequiredIndicator />
                      </Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          {...register("priority", {
                            required: "Please select a priority",
                          })}
                          placeholder="Select priority"
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="URGENT">Urgent</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                      <Field.ErrorText>
                        {errors.priority?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </GridItem>

                  <GridItem>
                    <Field.Root>
                      <Field.Label>Start Date</Field.Label>
                      <Input
                        type="date"
                        {...register("startDate")}
                        placeholder="Select start date"
                      />
                    </Field.Root>
                  </GridItem>

                  <GridItem>
                    <Field.Root>
                      <Field.Label>Due Date</Field.Label>
                      <Input
                        type="date"
                        {...register("dueDate")}
                        placeholder="Select due date"
                      />
                    </Field.Root>
                  </GridItem>
                </Grid>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  type="submit"
                  colorScheme="blue"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </Dialog.Footer>
            </form>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={handleClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default TaskForm;
