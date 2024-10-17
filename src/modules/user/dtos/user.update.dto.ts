import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserUpdateDto {
  @Expose()
  @ApiProperty({ description: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;
}
