import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config';

@ConfigDecorator('auth')
export class AuthConfig {
  @Expose()
  @IsNumber()
  @Type(() => Number)
  readonly accessTokenExpiration!: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  readonly refreshTokenExpiration!: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  readonly saltRounds!: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly accessTokenSecret!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly refreshTokenSecret!: string;
}
