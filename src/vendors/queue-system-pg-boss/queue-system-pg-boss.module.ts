import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import PgBoss, { MonitorStates, Worker } from 'pg-boss';

import { QUEUE_SYSTEM_PG_BOSS_MODULE_PROVIDER_TOKEN } from '~vendors/queue-system-pg-boss/queue-system-pg-boss.constants';
import { QueueSystemConfig } from '~vendors/queue-system/queue-system.config';

import { getConfig } from '~common/config';
import { LoggerService } from '~common/logging';

import { PrismaConfig } from '~database/prisma';

import { QueueSystemPgBossProcessorService } from './queue-system-pg-boss.processor.service';
import { createQueueSystemPgBossPublishProviders } from './utils/create-queue-system-pg-boss-publish-providers.util';

const queueSystemConfig = getConfig(QueueSystemConfig);

@Global()
@Module({
  imports: [],
  providers: [QueueSystemPgBossProcessorService],
})
export class QueueSystemPgBossModule {
  static forRootAsync(...queueNames: string[]): DynamicModule {
    const bossProvider: Provider = {
      provide: QUEUE_SYSTEM_PG_BOSS_MODULE_PROVIDER_TOKEN,
      useFactory: async (logger: LoggerService) => {
        const prismaConfig = getConfig(PrismaConfig);

        const boss = new PgBoss({
          connectionString: prismaConfig.databaseUrl,
        });

        await boss.start();
        boss.on('error', (error: Error) => logger.error(error));
        boss.on('stopped', () => logger.log(`pg-boss 'stopped' event captured.`));

        if (queueSystemConfig.debug) {
          boss.on('maintenance', () => logger.debug(`pg-boss 'maintenance' event captured.`));
          boss.on('wip', (data: Worker[]) => logger.debug(`pg-boss 'wip' event: ${JSON.stringify(data)}.`));
          boss.on('monitor-states', (monitorStates: MonitorStates) =>
            logger.debug(`pg-boss 'monitor-states' event: ${JSON.stringify(monitorStates)}.`),
          );
        }

        return boss;
      },
    };

    const publishProviders = createQueueSystemPgBossPublishProviders(queueNames);

    return {
      module: QueueSystemPgBossModule,
      imports: [],
      providers: [bossProvider, ...publishProviders],
      exports: [bossProvider, ...publishProviders],
    };
  }
}
