import { ITask } from '../interfaces/task.interface';
import { plainToValidatedInstance } from '~vendors/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

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
  @ApiProperty({ description: 'List of tasks', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  readonly tasks!: any[];
}

export class PaginatedTasksDtoMapper {
  static fromDomain(tasks: ITask[], totalTasks: number, totalPages: number, currentPage: number, tasksPerPage: number): PaginatedTasksDto {
    return plainToValidatedInstance(PaginatedTasksDto, {
      totalTasks,
      totalPages,
      currentPage,
      tasksPerPage,
      tasks: tasks.map(task => ({
        id: task.id,
        userId: task.userId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }))
    });
  }
}