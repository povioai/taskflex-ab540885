import { IPaginationMetadata } from 'src/modules/task-management/interfaces/pagination-metadata.interface';

export interface TaskManagementService {
  getPaginationMetadata(totalTasks: number, tasksPerPage: number, currentPage: number): IPaginationMetadata;
}

class TaskManagementServiceImpl implements TaskManagementService {
  getPaginationMetadata(totalTasks: number, tasksPerPage: number, currentPage: number): IPaginationMetadata {
    const totalPages = Math.ceil(totalTasks / tasksPerPage);
    return {
      totalItems: totalTasks,
      itemsPerPage: tasksPerPage,
      currentPage,
      totalPages
    };
  }
}