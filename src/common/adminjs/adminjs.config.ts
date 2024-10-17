import { Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

import { ConfigDecorator } from '~common/config';

@ConfigDecorator('adminjs')
export class AdminJSConfig {
  @Expose()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  path?: string;

  @Expose()
  @IsString()
  @ValidateIf((o) => o.enabled === true)
  email!: string;

  @Expose()
  @IsString()
  @ValidateIf((o) => o.enabled === true)
  password!: string;

  // Port for local development of adminjs
  @Expose()
  @IsNumber()
  devPort!: number;

  // List of queue names created by pgboss to show in AdminJS
  @Expose()
  @IsString({ each: true })
  @IsArray()
  pgBossQueues!: string[];
}
