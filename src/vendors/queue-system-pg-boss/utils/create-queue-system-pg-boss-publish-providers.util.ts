import { Logger, Provider } from '@nestjs/common';
import * as PgBoss from 'pg-boss';

import { QueueSystemPgBossPublishService } from '~vendors/queue-system-pg-boss/queue-system-pg-boss.publish.service';

import { QUEUE_SYSTEM_PUBLISH_TOKEN_PREFIX } from '../../queue-system/queue-system.constants';
import { QUEUE_SYSTEM_PG_BOSS_MODULE_PROVIDER_TOKEN } from '../queue-system-pg-boss.constants';

export function createQueueSystemPgBossPublishProviders(queueNames: string[]): Provider[] {
  return queueNames.map((queueName) => {
    const logger = new Logger(QueueSystemPgBossPublishService.name);

    return {
      provide: `${QUEUE_SYSTEM_PUBLISH_TOKEN_PREFIX}-${queueName}`,
      useFactory: (boss: PgBoss) => new QueueSystemPgBossPublishService(logger, boss, queueName),
      inject: [QUEUE_SYSTEM_PG_BOSS_MODULE_PROVIDER_TOKEN],
    };
  });
}
