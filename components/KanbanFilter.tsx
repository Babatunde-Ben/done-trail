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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LuPlus, LuSearch, LuCalendar, LuX } from "react-icons/lu";
import { Project } from "@/types";

type FilterState = {
  search: string;
  projectId: string;
  priority: string;
  startDate: string;
  endDate: string;
};

type KanbanFilterProps = {
  onFilter: (filters: FilterState) => void;
  onOpen: () => void;
  projects: Project[];
};

const KanbanFilter = ({ onFilter, onOpen, projects }: KanbanFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    projectId: "",
    priority: "",
    startDate: "",
    endDate: "",
  });

  const [showDateRange, setShowDateRange] = useState(false);

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
      startDate: "",
      endDate: "",
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <Box>
      <VStack gap={4} align="stretch">
        <HStack gap={4}>
          <InputGroup startElement={<LuSearch />}>
            <Input
              placeholder="Search by title"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </InputGroup>

          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder="All projects"
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

          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder="All priorities"
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <IconButton
            onClick={() => setShowDateRange(!showDateRange)}
            variant={showDateRange ? "subtle" : "outline"}
          >
            <LuCalendar />
          </IconButton>

          {hasActiveFilters && (
            <IconButton onClick={clearFilters} variant="outline">
              <LuX />
            </IconButton>
          )}

          <IconButton onClick={onOpen} colorScheme="blue">
            <LuPlus />
          </IconButton>
        </HStack>

        {showDateRange && (
          <HStack
            gap={4}
            p={4}
            bg="gray.50"
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
          >
            <Text fontSize="sm" fontWeight="medium" minW="fit-content">
              Date Range:
            </Text>
            <Input
              type="date"
              placeholder="Start date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
            <Text fontSize="sm" color="gray.500">
              to
            </Text>
            <Input
              type="date"
              placeholder="End date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                handleFilterChange("startDate", "");
                handleFilterChange("endDate", "");
              }}
            >
              Clear dates
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default KanbanFilter;
