import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config';

@ConfigDecorator('sentry')
export class SentryConfig {
  @Expose()
  @IsString()
  dsn: string = '';
}
