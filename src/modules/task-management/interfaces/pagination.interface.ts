import { IPaginationMetadata } from 'src/modules/task-management/interfaces/pagination-metadata.interface';

export interface TaskManagement {
  getPaginationMetadata(totalTasks: number, tasksPerPage: number, currentPage: number): IPaginationMetadata;
}

class TaskManagementImpl implements TaskManagement {
  getPaginationMetadata(totalTasks: number, tasksPerPage: number, currentPage: number): IPaginationMetadata {
    const totalPages = Math.ceil(totalTasks / tasksPerPage);
    const itemCount = tasksPerPage;
    const totalItems = totalTasks;
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return {
      totalItems,
      itemCount,
      itemsPerPage: tasksPerPage,
      totalPages,
      currentPage,
    };
  }
}