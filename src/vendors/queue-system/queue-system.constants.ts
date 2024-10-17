export const QUEUE_SYSTEM_PROCESSOR_METADATA_KEY = 'queue-system-processor-metadata-key';
export const QUEUE_SYSTEM_PROCESS_METADATA_KEY = 'queue-system-process-metadata-key';
export const QUEUE_SYSTEM_PUBLISH_TOKEN_PREFIX = 'queue-system-publish';

export const queueSystemConstants = {
  default: {
    processor: {
      batchSize: 1,
      sleep: 1000, // ms
      concurrency: 10,
    },
    retry: {
      count: 15,
      exponentialBackoffEnabled: true,
    },
  },
};
