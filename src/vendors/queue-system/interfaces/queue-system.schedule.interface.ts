import { IQueueSystemSendOptions } from './queue-system.send.options.interface';

export interface IQueueSystemSchedule {
  cron: string;
  id?: string;
  name: string;
  key?: string;
  options?: IQueueSystemSendOptions;
}
