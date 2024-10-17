import { Global, Module } from '@nestjs/common';

import { BaseLoggerService } from '~vendors/logger';

import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService, { provide: BaseLoggerService, useClass: LoggerService }],
  exports: [BaseLoggerService, LoggerService],
})
export class LoggerModule {}
