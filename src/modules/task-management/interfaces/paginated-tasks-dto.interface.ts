import { ITask } from './task.interface';
import { IPaginationMetadata } from './pagination-metadata.interface';

export interface IPaginatedTasksDto {
  tasks: ITask[];
  paginationMetadata: IPaginationMetadata;
}