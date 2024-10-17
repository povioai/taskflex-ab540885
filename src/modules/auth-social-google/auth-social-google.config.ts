import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config/index';

import { TransformInputToArray } from '~vendors/class-validator';

@ConfigDecorator('authSocialGoogle')
export class AuthSocialGoogleConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly clientId!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly clientSecret!: string;

  @Expose()
  @TransformInputToArray({ transformer: String })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly scopes: string[] = [];

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly responseType!: string;
}
