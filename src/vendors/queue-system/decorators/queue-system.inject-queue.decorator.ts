import { Inject } from '@nestjs/common';

import { QUEUE_SYSTEM_PUBLISH_TOKEN_PREFIX } from '../queue-system.constants';

export const QueueSystemInjectQueue = (queueName: string) =>
  Inject(`${QUEUE_SYSTEM_PUBLISH_TOKEN_PREFIX}-${queueName}`);
