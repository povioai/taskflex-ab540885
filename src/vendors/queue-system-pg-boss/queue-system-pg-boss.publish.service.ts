import { Inject, Injectable, Logger } from '@nestjs/common';
import * as PgBoss from 'pg-boss';

import { IQueueSystemSchedule } from '~vendors/queue-system/interfaces/queue-system.schedule.interface';
import { IQueueSystemSendOptions } from '~vendors/queue-system/interfaces/queue-system.send.options.interface';
import { queueSystemConstants } from '~vendors/queue-system/queue-system.constants';
import { QueueSystemPublishService } from '~vendors/queue-system/queue-system.publish.service';

@Injectable()
export class QueueSystemPgBossPublishService<JobType extends string> implements QueueSystemPublishService<JobType> {
  static readonly QUEUE_SYSTEM_PG_BOSS_PUBLISH_SERVICE_LOGGER = 'queue-system-pg-boss-publish-service-logger';

  constructor(
    @Inject(QueueSystemPgBossPublishService.QUEUE_SYSTEM_PG_BOSS_PUBLISH_SERVICE_LOGGER)
    private logger: Logger,
    private boss: PgBoss,
    private processName: string,
  ) {}

  async send<JobData extends object>(
    jobType: JobType,
    jobData: JobData,
    options?: IQueueSystemSendOptions,
  ): Promise<void> {
    this.logger.debug(`Sending message to process ${this.processName} for processing. Job type: ${jobType}.`);

    const data = this.formatData(jobType, jobData);
    const pgBossOptions = this.formatPgBossOptions(options);

    await this.boss.send(this.processName, data, pgBossOptions);
  }

  async sendFuture<JobData extends object>(
    jobType: JobType,
    jobData: JobData,
    startDate: Date,
    options?: IQueueSystemSendOptions,
  ): Promise<void> {
    this.logger.debug(
      `Sending message to process ${this.processName} for future processing. Job type: ${jobType}. Start date: ${startDate}.`,
    );

    const data = this.formatData(jobType, jobData);
    const pgBossOptions = this.formatPgBossOptions(options);

    await this.boss.send(this.processName, data, { ...pgBossOptions, startAfter: startDate });
  }

  async cronSchedule<JobData extends object>(
    jobType: JobType,
    jobData: JobData,
    cronExpression: string,
    options?: IQueueSystemSendOptions,
  ): Promise<void> {
    this.logger.debug(
      `Sending message to process ${this.processName} for cron scheduling. Job type: ${jobType}. cron expression: ${cronExpression}.`,
    );

    const data = this.formatData(jobType, jobData);
    const pgBossOptions = this.formatPgBossOptions(options);

    await this.boss.schedule(this.processName, cronExpression, data, pgBossOptions);
  }

  async cronUnschedule(): Promise<void> {
    this.logger.debug(`Performing cron unscheduling for process ${this.processName}.`);

    await this.boss.unschedule(this.processName);
  }

  async cronList(): Promise<IQueueSystemSchedule[]> {
    this.logger.debug(`Performing cron listing for process ${this.processName}.`);

    const schedules = await this.boss.getSchedules();

    const result = schedules.map((schedule) => {
      const item: IQueueSystemSchedule = {
        cron: schedule.cron,
        name: schedule.name,
        options: {
          groupId: schedule.options?.singletonKey,
          retryCount: schedule.options?.retryLimit,
          retryExponentialBackoffEnabled: schedule.options?.retryBackoff,
        },
      };
      return item;
    });

    return result;
  }

  private formatData<JobData extends object>(jobType: JobType, jobData: JobData): object {
    return { jobType, ...jobData };
  }

  private formatPgBossOptions(options?: IQueueSystemSendOptions): PgBoss.SendOptions {
    const singletonKey = options?.groupId;
    const retryLimit = options?.retryCount ?? queueSystemConstants.default.retry.count;
    const retryBackoff =
      options?.retryExponentialBackoffEnabled ?? queueSystemConstants.default.retry.exponentialBackoffEnabled;

    return { singletonKey, retryLimit, retryBackoff };
  }
}
