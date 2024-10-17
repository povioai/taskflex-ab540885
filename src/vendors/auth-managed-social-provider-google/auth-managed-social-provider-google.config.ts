import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { TransformInputToArray } from '~vendors/class-validator';

export class AuthManagedSocialProviderGoogleConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly clientId!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly clientSecret!: string;

  @Expose()
  @IsNotEmpty()
  @TransformInputToArray({ transformer: String })
  @IsArray()
  @IsString({ each: true })
  readonly scopes!: string[];

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly responseType!: string;
}

export interface IAuthManagedSocialProviderGoogleConfig extends AuthManagedSocialProviderGoogleConfig {}
