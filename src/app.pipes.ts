import { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { mw as RequestIpMiddleware } from 'request-ip';

import { getValidationPipe } from '~vendors/class-validator/validation-pipe';

import { ValidationException } from '~common/exceptions';
import { HttpExceptionsFilter } from '~common/exceptions/filters/http-exceptions.filter';
import { useCors } from '~common/http/cors/cors.middleware';
import { useTimeoutInterceptor } from '~common/http/interceptors/timeout.interceptor';
import { setupOpenApi } from '~common/http/openapi/openapi.middleware';
import { ExpressLoggerMiddleware } from '~common/logging/express-logger.middleware';

/**
 * Standard request pipeline
 */
export function requestPipes(app: INestApplication): void {
  app.use(RequestIpMiddleware());

  // hook: before-http

  useCors(app);

  // hook: http

  app.use(ExpressLoggerMiddleware);

  app.useGlobalFilters(
    /**
     * Request Agnostic Exception Handler
     *  - log exceptions
     *  - convert exceptions to POJO response
     */
    new HttpExceptionsFilter(app.get(HttpAdapterHost)),

    // More specific filters should go here
  );

  app.useGlobalPipes(
    /**
     * Request Agnostic Transform/Validate
     *  - same options as `plainToValidatedInstance`
     */
    getValidationPipe(ValidationException.fromValidationErrorArray),
  );

  useTimeoutInterceptor(app);

  // hook: after-interceptors
  setupOpenApi(app);
}
