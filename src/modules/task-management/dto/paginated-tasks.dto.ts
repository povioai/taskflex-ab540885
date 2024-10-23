import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

// Commenting out the import as the module './task.dto' is not found
// import { TaskDto } from './task.dto'; // Assuming there's a TaskDto defined elsewhere

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
  @ApiProperty({ description: 'List of tasks', type: [Object] }) // Changed to Object as a placeholder
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object) // Changed to Object as a placeholder
  readonly tasks!: any[]; // Changed to any[] as a placeholder
}