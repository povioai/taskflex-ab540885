import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ITask } from '../interfaces/task.interface';

export class TaskResponseDto {
  @Expose()
  @ApiProperty({ description: 'Id of the task' })
  @IsString()
  @IsNotEmpty()
  readonly id!: string;

  @Expose()
  @ApiProperty({ description: 'Title of the task' })
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @Expose()
  @ApiProperty({ description: 'Description of the task' })
  @IsString()
  @IsNotEmpty()
  readonly description!: string;

  @Expose()
  @ApiProperty({ description: 'Status of the task' })
  @IsString()
  @IsNotEmpty()
  readonly status!: string;

  @Expose()
  @ApiProperty({ description: 'Creation time of the task' })
  @IsString()
  @IsNotEmpty()
  readonly createdAt!: string;

  static fromITask(task: ITask): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt.toISOString(),
    };
  }
}
