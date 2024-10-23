import { IPaginationParameters } from 'src/modules/task-management/interfaces/pagination-parameters.interface';

export interface TaskManagementRepository {
  getPaginationParameters(page: number, tasksPerPage: number): IPaginationParameters;
}

class TaskManagementRepositoryImpl implements TaskManagementRepository {
  getPaginationParameters(page: number, tasksPerPage: number): IPaginationParameters {
    const totalItems = 0; // Assuming default value, replace with actual logic
    const totalPages = Math.ceil(totalItems / tasksPerPage);
    return { page, pageSize: tasksPerPage, totalItems, totalPages };
  }
}