import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config';

@ConfigDecorator('cognito')
export class OpenidClientAwsCognitoConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly region!: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly userPoolId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly clientId?: string;
}
