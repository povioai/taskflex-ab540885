import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, plainToInstance } from 'class-transformer';
import { IsNumber, IsArray, ValidateNested } from 'class-validator';

// Assuming TaskDto is defined elsewhere and should be imported correctly
// import { TaskDto } from './task.dto';

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  readonly tasks!: TaskDto[];

  static create(data: { totalTasks: number; totalPages: number; currentPage: number; tasksPerPage: number; tasks: any[] }, taskConverter: (data: any) => TaskDto): PaginatedTasksDto {
    return plainToInstance(PaginatedTasksDto, {
      ...data,
      tasks: data.tasks.map(task => taskConverter(task)),
    }, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    });
  }
}