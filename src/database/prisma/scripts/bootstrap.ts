/**
 * Setup environment for Prisma CLI
 *   - Disable Telemetry
 *   - Set DATABASE_URL
 *
 *   yarn ts-node -r tsconfig-paths/register src/database/prisma/scripts/bootstrap.ts
 */
import 'reflect-metadata';

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getConfig } from '~common/config';

import { PrismaConfig } from '../prisma.config';

const prismaConfig = getConfig(PrismaConfig);

const env = `CHECKPOINT_DISABLE=1
DATABASE_URL=${prismaConfig.databaseUrl}`;

const prismaDir = resolve(__dirname, '../../../../resources/prisma');
if (!existsSync(prismaDir)) {
  mkdirSync(prismaDir);
}

/**
 * Write .env file in the same directory as schema.prisma
 * @see https://www.prisma.io/docs/orm/more/development-environment/environment-variables/env-files
 */
writeFileSync(resolve(prismaDir, '.env'), env);
