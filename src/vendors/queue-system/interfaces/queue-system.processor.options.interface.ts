export interface IQueueSystemProcessorOptions {
  name: string;
  concurrency?: number;
  sleepMs?: number;
  batchSize?: number;
}
