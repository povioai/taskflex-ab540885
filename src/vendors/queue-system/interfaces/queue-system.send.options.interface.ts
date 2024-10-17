export interface IQueueSystemSendOptions {
  groupId?: string;
  retryCount?: number;
  retryExponentialBackoffEnabled?: boolean;
}
