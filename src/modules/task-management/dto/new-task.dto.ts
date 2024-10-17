import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ITaskCreate } from '../interfaces/task-create.interface';

export class NewTaskDto {
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

  toITaskCreate(userId: string, status: string): ITaskCreate {
    return {
      userId,
      title: this.title,
      description: this.description,
      status,
    };
  }
}
