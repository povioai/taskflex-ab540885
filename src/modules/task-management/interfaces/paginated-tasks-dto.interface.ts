import { ITask } from './task.interface';
import { IPaginationMetadata } from './pagination-metadata.interface';

export interface IPaginatedTasks {
  tasks: ITask[];
  paginationMetadata: IPaginationMetadata;
}