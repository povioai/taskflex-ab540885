import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskStatusDTO {
  @Expose()
  @ApiProperty({ description: 'New status of the task' })
  @IsString()
  @IsNotEmpty()
  readonly status!: string;

  toServiceArguments(taskId: string, currentUserId: string): [string, string, string] {
    return [taskId, this.status, currentUserId];
  }
}
