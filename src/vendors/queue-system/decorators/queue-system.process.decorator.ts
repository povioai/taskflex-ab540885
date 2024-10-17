import { SetMetadata } from '@nestjs/common';

import { QUEUE_SYSTEM_PROCESS_METADATA_KEY } from '../queue-system.constants';

export const QueueSystemProcess = (jobType: string): MethodDecorator => {
  return (target, key, descriptor) => {
    SetMetadata(QUEUE_SYSTEM_PROCESS_METADATA_KEY, jobType)(target, key, descriptor);
  };
};
