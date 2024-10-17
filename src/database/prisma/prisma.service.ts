import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import type { BaseLogLevel } from '~vendors/logger';

import { LoggerService } from '~common/logging';

import { PrismaConfig } from './prisma.config';

type IPrismaClient = PrismaClient<Prisma.PrismaClientOptions, 'info' | 'query' | 'warn' | 'error'>;

let singleton: IPrismaClient;

function getPrismaClient(prismaConfig: PrismaConfig, logger: LoggerService): IPrismaClient {
  if (!singleton) {
    /**
     * Prevent multiple instances of PrismaClient
     *  @see https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
     */
    singleton = new PrismaClient({
      /**
       * Trust the database connection string from schema.prisma
       *  Defaults to DATABASE_URL, and it set at `prisma:bootstrap`
       *  and it should equal to `prismaConfig.databaseUrl`
       * datasources, datasourceUrl
       */
      // datasourceUrl: prismaConfig.databaseUrl,

      /**
       * Log Prisma Client queries as events to the logger
       */
      log: prismaConfig.log?.map((level) => ({ emit: 'event', level })),

      transactionOptions: {
        //maxWait: 2000,
        //timeout: 5000,
        /**
         * The isolation level of the transaction, Serializable is most strict
         *  @see https://www.prisma.io/docs/orm/prisma-client/queries/transactions#transaction-isolation-level
         */
        isolationLevel: 'Serializable',
      },
    });

    for (const [a, b] of [
      ['info', 'debug'],
      ['warn', 'warn'],
      ['error', 'error'],
    ] as [Prisma.LogLevel, BaseLogLevel & keyof LoggerService][]) {
      if (prismaConfig.log?.includes(a) && logger.isLevelEnabled(b)) {
        singleton.$on(a, (event) => {
          logger[b](event);
        });
      }
    }

    if (prismaConfig.log?.includes('query') && logger.isLevelEnabled('debug')) {
      singleton.$on('query', (event) => {
        logger.log({
          context: 'PrismaQuery',
          data: event,
          message: event.query,
          level: 'log',
        });
      });
    }
  }
  return singleton;
}

@Injectable()
export class PrismaService implements OnModuleInit {
  public client: PrismaClient;

  constructor(
    private readonly config: PrismaConfig,
    private readonly logger: LoggerService,
  ) {
    process.env.DATABASE_URL = config.databaseUrl;
    process.env.CHECKPOINT_DISABLE = '1';
    this.client = getPrismaClient(config, logger);
  }

  async onModuleInit() {
    /**
     * Prisma connects to the database when the first query is executed,
     *  but we want to fail fast if the credentials are incorrect
     * @see https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-management#connect
     */
    if (this.config.autoConnect) {
      await this.client.$connect();
    }
  }

  /**
   * Controlled shutdown
   *  Prisma will automatically disconnect on SIGINT, you do not have to call `$disconnect`.
   *  After the call, Prisma will attempt to wait for all queries to finish before terminating.
   *
   *  prisma.$on('beforeExit', async () => runShutdownHooks());
   *  public shutdownHooks: Record<string, () => Promise<void>> = {};
   *  private runShutdownHooks = async () => {
   *    await Promise.all(Object.values(this.shutdownHooks).map((hook) => hook()));
   *  };
   *
   *  @see https://docs.nestjs.com/fundamentals/lifecycle-events
   */
}
