import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class PushNotificationTokenPostDto {
  @ApiProperty({ description: 'Token' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly token!: string;
}
