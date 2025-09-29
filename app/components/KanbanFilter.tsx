import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  NativeSelect,
  VStack,
  Text,
  Button,
  Portal,
  Popover,
  Field,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LuPlus, LuSearch, LuCalendar, LuX } from "react-icons/lu";
import { priorities, projects } from "@/app/utils/constant";
import { FilterState } from "@/types";

type KanbanFilterProps = {
  onFilter: (filters: FilterState) => void;
  onOpen: () => void;
};

const KanbanFilter = ({ onFilter, onOpen }: KanbanFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    projectId: "",
    priority: "",
    dueDateFrom: "",
    dueDateTo: "",
  });

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      projectId: "",
      priority: "",
      dueDateFrom: "",
      dueDateTo: "",
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <Box>
      <VStack gap={4} align="stretch">
        <HStack gap={3} flexWrap="wrap" align="stretch">
          <InputGroup
            startElement={<LuSearch />}
            flex={{ base: "1 1 100%", sm: "1 1 280px" }}
            minW={{ base: "100%", sm: "260px" }}
          >
            <Input
              placeholder="Search by title"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              w="100%"
              size={"sm"}
            />
          </InputGroup>

          <NativeSelect.Root
            flex={{ base: "1 1 100%", sm: "1 1 220px" }}
            minW={{ base: "100%", sm: "200px" }}
            size={"sm"}
          >
            <NativeSelect.Field
              placeholder="Select project"
              value={filters.projectId}
              onChange={(e) => handleFilterChange("projectId", e.target.value)}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <NativeSelect.Root
            flex={{ base: "1 1 100%", sm: "1 1 180px" }}
            minW={{ base: "100%", sm: "180px" }}
            size={"sm"}
          >
            <NativeSelect.Field
              placeholder="Select priority"
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              {priorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <Popover.Root>
            <Popover.Trigger asChild>
              <IconButton variant={"outline"} size={"sm"}>
                <LuCalendar />
              </IconButton>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content maxW={{ base: "90vw", md: "md" }} w="100%">
                  <Popover.Arrow />
                  <Popover.Body>
                    <Popover.Title fontWeight="medium">
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        textAlign="center"
                        fontWeight="medium"
                        mb={2}
                      >
                        Due Date Range
                      </Text>
                    </Popover.Title>

                    <VStack gap={2}>
                      <Field.Root>
                        <Field.Label>From</Field.Label>

                        <Input
                          type="date"
                          placeholder="Start date"
                          value={filters.dueDateFrom}
                          onChange={(e) =>
                            handleFilterChange("dueDateFrom", e.target.value)
                          }
                        />
                      </Field.Root>

                      <Field.Root>
                        <Field.Label>To</Field.Label>

                        <Input
                          type="date"
                          placeholder="End date"
                          value={filters.dueDateTo}
                          onChange={(e) =>
                            handleFilterChange("dueDateTo", e.target.value)
                          }
                        />
                      </Field.Root>
                    </VStack>
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>

          {hasActiveFilters && (
            <Button size={"sm"} onClick={clearFilters} variant="outline">
              <LuX />
              Clear Filters
            </Button>
          )}

          <Button size={"sm"} onClick={onOpen} w={{ base: "100%", md: "auto" }}>
            <LuPlus />
            Add Task
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default KanbanFilter;
