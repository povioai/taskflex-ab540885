#!/usr/bin/env node
/**
 *  Build OpenAPI spec from the API controllers
 *
 *  yarn ts-node -r tsconfig-paths/register src/common/http/openapi/scripts/openapi.tsc.build.ts
 */

import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { AppModule } from '~app.module';

import { getSwaggerDocument } from './openapi.helpers';

const openApiJsonPath = resolve(__dirname, '../../../../', 'resources', 'openapi.json');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const document = getSwaggerDocument(app);

  // eslint-disable-next-line no-console
  console.log(`>>> creating ${openApiJsonPath}`);
  writeFileSync(openApiJsonPath, JSON.stringify(document));

  await app.close();
}

bootstrap().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
