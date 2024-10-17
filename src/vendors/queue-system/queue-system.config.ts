import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

import { ConfigDecorator } from '~common/config';

@ConfigDecorator('queue-system')
export class QueueSystemConfig {
  @IsNumber()
  @IsOptional()
  maxThreadCount?: number;

  @IsNumber()
  @IsOptional()
  batchSize?: number;

  @IsNumber()
  @IsOptional()
  sleep?: number;

  @IsNumber()
  @IsOptional()
  concurrency?: number;

  @IsBoolean()
  @IsOptional()
  debug?: boolean;
}
