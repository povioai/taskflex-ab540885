import type { LogLevel } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { Allow, IsBoolean, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';

import { BaseLogLevel, BaseLogLevelEnum } from '~vendors/logger';

import { ConfigDecorator } from '~common/config';

export enum SpanProcessorType {
  SIMPLE = 'simple',
  BATCH = 'batch',
}

export enum LogRecordProcessorType {
  SIMPLE = 'simple',
  BATCH = 'batch',
}

@ConfigDecorator('logger.otel')
export class OtelConfig {
  @Expose()
  @IsBoolean()
  enabled = false;

  @Expose()
  @IsBoolean()
  debug = false;

  @Expose()
  @IsString()
  @ValidateIf((o) => o.enabled)
  exporterEndpoint!: string;

  @Expose()
  @IsString()
  @ValidateIf((o) => o.enabled)
  exporterTracesEndpoint!: string;

  @Expose()
  @IsString()
  @ValidateIf((o) => o.enabled)
  exporterLogsEndpoint!: string;

  @Expose()
  @IsEnum(SpanProcessorType)
  spanProcessor: SpanProcessorType = SpanProcessorType.SIMPLE;

  @Expose()
  @IsString()
  @IsEnum(LogRecordProcessorType)
  logRecordProcessor: LogRecordProcessorType = LogRecordProcessorType.SIMPLE;

  @Expose()
  @IsBoolean()
  hostMetrics = false;

  @Expose()
  @IsBoolean()
  apiMetrics = false;

  @Expose()
  @IsEnum(BaseLogLevelEnum)
  level: LogLevel = 'warn';

  @Expose()
  @IsOptional()
  @Allow()
  @Transform((value) => value.obj?.contexts)
  contexts?: Record<string, BaseLogLevel>;
}

@ConfigDecorator('logger.otel.highlight')
export class HighLightConfig {
  @Expose()
  @IsString()
  @IsOptional()
  projectId?: string;
}
