import { Global, Module } from '@nestjs/common';

import { QueueSystemPgBossModule } from '~vendors/queue-system-pg-boss/queue-system-pg-boss.module';

import { QUEUE_SYSTEM_RAG_QUEUE_METADATA_KEY } from './queue-system.queues';

@Global()
@Module({
  imports: [
    // [dev] register queue system queues here...
    QueueSystemPgBossModule.forRootAsync(QUEUE_SYSTEM_RAG_QUEUE_METADATA_KEY),
  ],
})
export class QueueSystemModule {}
