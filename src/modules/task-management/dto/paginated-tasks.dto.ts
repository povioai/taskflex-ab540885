import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

// Commenting out the import as TaskDto is not defined
// import { TaskDto } from './task.dto'; // Assuming TaskDto is defined elsewhere

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
  @ApiProperty({ description: 'List of tasks', type: [Object] }) // Changed type to Object as TaskDto is not defined
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object) // Changed type to Object as TaskDto is not defined
  readonly tasks!: any[]; // Changed type to any[] as TaskDto is not defined
}