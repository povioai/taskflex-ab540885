import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

// Assuming TaskDto is defined elsewhere, comment out the import for now
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
  @ApiProperty({ description: 'List of tasks', type: [Object] }) // Changed TaskDto to Object
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object) // Changed TaskDto to Object
  readonly tasks!: any[]; // Changed TaskDto[] to any[]
}