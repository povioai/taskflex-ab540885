// src/modules/task-management/interfaces/pagination.interface.ts
export interface PaginationMetadata {
  totalTasks: number;
  tasksPerPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// src/modules/task-management/utils/pagination.utils.ts
export function getPaginationMetadata(totalTasks: number, tasksPerPage: number, currentPage: number): PaginationMetadata {
  const totalPages = Math.ceil(totalTasks / tasksPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    totalTasks,
    tasksPerPage,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage
  };
}