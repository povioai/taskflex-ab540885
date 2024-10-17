import { Expose, Transform } from 'class-transformer';
import { Allow, IsString } from 'class-validator';

import { type BaseLogLevel, BaseLoggerConfig } from '~vendors/logger';

import { ConfigDecorator } from '~common/config';

@ConfigDecorator('logger')
export class BasicLoggerConfig extends BaseLoggerConfig {
  @Expose()
  @IsString()
  output = 'json';

  @Expose()
  @Allow()
  @Transform((value) => value.obj?.contexts)
  contexts?: Record<string, BaseLogLevel>;
}
