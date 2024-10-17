import { INestApplication } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { IsNumber, Validate } from 'class-validator';

import { ConfigDecorator, getConfig } from '~common/config';

/**
 * CORS Configuration
 * @see https://github.com/expressjs/cors#configuration-options
 */
@ConfigDecorator('http.cors')
export class CorsConfig {
  /**
   * The URL to allow CORS requests from
   *  - false for none
   *  - true for all
   *  - string for array of comma separated RegExp
   *  - array for RegExp
   */
  @Expose()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value?.map((x: string) => RegExp(x)) || value,
  )
  @Validate(
    (value: any) =>
      typeof value === 'boolean' || (Array.isArray(value) && value.every((x: any) => x instanceof RegExp)),
  )
  origin: RegExp[] | boolean = true;

  @Expose()
  @IsNumber()
  maxAge = 3600;
}

const corsConfig = getConfig(CorsConfig);

export function useCors(app: INestApplication) {
  app.enableCors({
    maxAge: corsConfig.maxAge,
    // Configures the Access-Control-Allow-Credentials CORS header.
    credentials: true,
    origin: corsConfig.origin,
  });
}
