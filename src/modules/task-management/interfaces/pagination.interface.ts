import { IPaginationParameters } from 'src/modules/task-management/interfaces/pagination-parameters.interface';

export interface TaskManagement {
  getPaginationParameters(page: number, tasksPerPage: number): IPaginationParameters;
}

class TaskManagementImpl implements TaskManagement {
  getPaginationParameters(page: number, tasksPerPage: number): IPaginationParameters {
    return {
      page,
      pageSize: tasksPerPage,
    };
  }
}