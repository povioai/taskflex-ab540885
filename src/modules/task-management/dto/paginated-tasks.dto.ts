import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, plainToInstance } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { TaskDto } from './task.dto'; // Re-import TaskDto

export class PaginatedTasksDto {
  @Expose()
  @ApiProperty({ description: 'Total number of tasks' })
  @IsNumber()
  readonly totalTasks!: number;

  @Expose()
  @ApiProperty({ description: 'Total number of pages' })
  @IsNumber()
  readonly totalPages!: number;

  @Expose()
  @ApiProperty({ description: 'Current page number' })
  @IsNumber()
  readonly currentPage!: number;

  @Expose()
  @ApiProperty({ description: 'Number of tasks per page' })
  @IsNumber()
  readonly tasksPerPage!: number;

  @Expose()
  @ApiProperty({ description: 'List of tasks', type: [TaskDto] })
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  readonly tasks!: TaskDto[];

  static create(tasks: any[], totalTasks: number, totalPages: number, currentPage: number, tasksPerPage: number): PaginatedTasksDto {
    return plainToInstance(PaginatedTasksDto, {
      tasks: tasks.map(task => plainToInstance(TaskDto, task)),
      totalTasks,
      totalPages,
      currentPage,
      tasksPerPage,
    });
  }
}