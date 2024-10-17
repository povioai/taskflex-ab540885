import { Inject, Injectable, InjectionToken, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import * as PgBoss from 'pg-boss';

import { getConfig } from '~common/config';
import { LoggerService } from '~common/logging';
import { IQueueSystemProcessorOptions } from '~vendors/queue-system/interfaces/queue-system.processor.options.interface';
import { QueueSystemConfig } from '~vendors/queue-system/queue-system.config';
import {
  QUEUE_SYSTEM_PROCESSOR_METADATA_KEY,
  QUEUE_SYSTEM_PROCESS_METADATA_KEY,
  queueSystemConstants,
} from '~vendors/queue-system/queue-system.constants';

import { QUEUE_SYSTEM_PG_BOSS_MODULE_PROVIDER_TOKEN } from './queue-system-pg-boss.constants';

const queueSystemConfig: QueueSystemConfig = getConfig(QueueSystemConfig);

@Injectable()
export class QueueSystemPgBossProcessorService implements OnApplicationShutdown, OnApplicationBootstrap {
  constructor(
    private readonly logger: LoggerService,
    @Inject(QUEUE_SYSTEM_PG_BOSS_MODULE_PROVIDER_TOKEN)
    private readonly boss: PgBoss,
    private readonly modulesContainer: ModulesContainer,
  ) {
    this._shouldContinueProcessing = true;
    this._jobProcessingLoops = [];

    this._defaultMaxThreadCount = queueSystemConfig.concurrency ?? queueSystemConstants.default.processor.concurrency;
    this._defaultBatchSize = queueSystemConfig.batchSize ?? queueSystemConstants.default.processor.batchSize;
    this._defaultSleep = queueSystemConfig.sleep ?? queueSystemConstants.default.processor.sleep;
  }

  public onApplicationBootstrap() {
    this.initializeProcessors();
  }

  private _shouldContinueProcessing: boolean;
  private _jobProcessingLoops: Promise<void>[];

  private _defaultMaxThreadCount: number;
  private _defaultBatchSize: number;
  private _defaultSleep: number;

  private initializeProcessors() {
    const providers = [...this.modulesContainer.values()].map((module) => module.providers);

    providers.forEach((wrapperMap: Map<InjectionToken, InstanceWrapper>) => {
      wrapperMap.forEach((wrapper: InstanceWrapper) => {
        const { instance } = wrapper;
        if (!instance) {
          return;
        }

        const isProcessor = Reflect.getMetadata(QUEUE_SYSTEM_PROCESSOR_METADATA_KEY, instance.constructor);
        if (!isProcessor) {
          return;
        }

        this.setupProcessor(instance);
      });
    });
  }

  private setupProcessor(instance: any) {
    const processorOptions = Reflect.getMetadata(QUEUE_SYSTEM_PROCESSOR_METADATA_KEY, instance.constructor) as
      | IQueueSystemProcessorOptions
      | undefined;

    if (processorOptions) {
      const loop = this.createJobProcessingLoop(processorOptions, instance);
      this._jobProcessingLoops.push(loop);
    }
  }

  private createJobProcessingLoop(processorOptions: IQueueSystemProcessorOptions, instance: any): Promise<void> {
    const { name: processorName } = processorOptions;
    const batchSize = processorOptions.batchSize ?? this._defaultBatchSize;
    const maxThreadCount = processorOptions.concurrency ?? this._defaultMaxThreadCount;
    const sleep = processorOptions.sleepMs ?? this._defaultSleep;
    let threadCount = 0;

    return (async () => {
      while (true) {
        this.logDebug(processorName, `Thread count: ${threadCount}.`);

        if (!this._shouldContinueProcessing) {
          break;
        }

        if (threadCount <= maxThreadCount) {
          try {
            const jobs = await this.boss.fetch(processorName, batchSize);

            if (jobs) {
              this.logDebug(processorName, `Found jobs to process! jobs: ${JSON.stringify(jobs)}.`);

              jobs.forEach((job) => {
                threadCount++;
                const jobData = job.data as { jobType?: string };
                const jobType = jobData.jobType;

                const handler = this.getHandlerForJobType(instance, jobType);
                if (handler) {
                  handler(job.data)
                    .then(async () => await this.boss.complete(job.id))
                    .catch(async (error) => {
                      this.logger.error(`Error processing job ${job.id}.`, error);
                      await this.boss.fail(job.id, error);
                    })
                    .finally(() => threadCount--);
                } else {
                  this.boss.fail(job.id, new Error('jobType is missing from job data.'));
                }
              });
            }
          } catch (error) {
            this.logger.error(error);
          }
        }

        await new Promise((resolve) => setTimeout(resolve, sleep));
      }
    })();
  }

  private getHandlerForJobType(instance: any, jobType?: string): ((job: any) => Promise<void>) | null {
    if (!jobType) {
      return null;
    }

    const prototype = Object.getPrototypeOf(instance);
    const methods = Object.getOwnPropertyNames(prototype).filter(
      (method) => method !== 'constructor' && typeof prototype[method] === 'function',
    );

    for (const methodName of methods) {
      const method = prototype[methodName];
      const methodJobType = Reflect.getMetadata(QUEUE_SYSTEM_PROCESS_METADATA_KEY, method);
      if (methodJobType === jobType) {
        return method.bind(instance) as (job: any) => Promise<void>;
      }
    }

    return null;
  }

  private logDebug(processorName: string, message: string): void {
    if (queueSystemConfig.debug) {
      this.logger.debug(`-- processor ${processorName} -- ${message}`);
    }
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Shutdown signal received: ${signal}. Shutting down queue system job processors.`);
    this._shouldContinueProcessing = false;

    await Promise.all(this._jobProcessingLoops);
    await this.boss.stop();
  }
}
