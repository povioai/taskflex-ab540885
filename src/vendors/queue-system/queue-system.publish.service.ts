import { IQueueSystemSendOptions } from '~vendors/queue-system/interfaces/queue-system.send.options.interface';

import { IQueueSystemSchedule } from './interfaces/queue-system.schedule.interface';

export abstract class QueueSystemPublishService<JobType extends string> {
  abstract send<JobData extends object>(
    jobType: JobType,
    jobData: JobData,
    options?: IQueueSystemSendOptions,
  ): Promise<void>;

  abstract sendFuture<JobData extends object>(
    jobType: JobType,
    jobData: JobData,
    startDate: Date,
    options?: IQueueSystemSendOptions,
  ): Promise<void>;

  abstract cronSchedule<JobData extends object>(
    jobType: JobType,
    jobData: JobData,
    cronExpression: string,
    options?: IQueueSystemSendOptions,
  ): Promise<void>;

  abstract cronUnschedule(identification?: string): Promise<void>;

  abstract cronList(): Promise<IQueueSystemSchedule[]>;
}
