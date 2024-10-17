import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config';

@ConfigDecorator('auth')
export class AuthManagedCustomProviderEmailPasswordConfig {
  @Expose()
  @IsNumber()
  readonly saltRounds: number = 10;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly accessTokenSecret!: string;

  @Expose()
  @IsNumber()
  readonly accessTokenExpiration!: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly refreshTokenSecret!: string;

  @Expose()
  @IsNumber()
  readonly refreshTokenExpiration!: number;
}
