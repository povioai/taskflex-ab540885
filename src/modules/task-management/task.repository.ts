import { ITaskCreate } from '~modules/task-management/interfaces/task-create.interface';
import { ITaskUpdate } from '~modules/task-management/interfaces/task-update.interface';
import { ITask } from '~modules/task-management/interfaces/task.interface';
import { PaginationMetadata } from '~modules/task-management/interfaces/pagination.interface';

export interface TaskRepository {
  findTaskById(id: string): Promise<ITask | undefined>;
  createTask(input: ITaskCreate): Promise<ITask>;
  updateTask(id: string, input: ITaskUpdate): Promise<ITask>;
  deleteTask(id: string): Promise<void>;
  getPaginatedTasks(page: number, tasksPerPage: number): Promise<{ tasks: ITask[], pagination: PaginationMetadata }>;
}