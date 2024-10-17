import type { LogLevel } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { Allow, IsBoolean, IsEnum, IsNumber, IsOptional, IsUrl, ValidateIf } from 'class-validator';

import { BaseLogLevel, BaseLogLevelEnum } from '~vendors/logger';

import { ConfigDecorator } from '~common/config';

@ConfigDecorator('logger.sentry')
export class SentryConfig {
  @Expose()
  @IsUrl()
  @IsOptional()
  @ValidateIf((o) => o.enabled)
  dsn?: string;

  @Expose()
  @IsNumber()
  sampleRate: number = 1.0;

  /**
   *  Add Tracing by setting tracesSampleRate
   *  We recommend adjusting this value in production
   */
  @Expose()
  @IsNumber()
  tracesSampleRate: number = 1.0;

  /**
   * Set sampling rate for profiling
   * This is relative to tracesSampleRate
   */
  @Expose()
  @IsNumber()
  profilesSampleRate: number = 1.0;

  @Expose()
  @IsBoolean()
  debug: boolean = false;

  @Expose()
  @IsEnum(BaseLogLevelEnum)
  level: LogLevel = 'warn';

  @Expose()
  @Allow()
  @Transform((value) => value.obj?.contexts)
  contexts?: Record<string, BaseLogLevel>;
}

export interface ISentryConfig extends SentryConfig {}
