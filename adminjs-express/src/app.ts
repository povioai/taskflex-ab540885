import * as PrismaModule from '@prisma/client';
import express from 'express';
import { join } from 'node:path';

import { adminRouter } from './components.js';
import { readConfig } from './config/config.helpers.js';
import { IAdminJSConfig } from './interfaces/adminjs.config.interface.js';
import { IDatabaseConfig } from './interfaces/database.config.interface.js';

const start = async () => {
  const app = express();
  const rawConfig = readConfig({ moduleName: 'local.api', directory: `${join(process.cwd(), '..', '.config')}` });
  const adminjsConfig = rawConfig.adminjs as IAdminJSConfig;
  const dbConfig = rawConfig.database as IDatabaseConfig;
  const prisma = new PrismaModule.PrismaClient({ datasources: { db: { url: dbConfig.url } } });

  const rootPath = `/${adminjsConfig.path}`;

  app.use(
    rootPath,
    await adminRouter({
      rootPath,
      dbUrl: dbConfig.url,
      authenticate: async (email, password) => {
        if (email === adminjsConfig.email && password === adminjsConfig.password) {
          return {
            email: adminjsConfig.email,
            password: adminjsConfig.password,
          };
        }
        return null;
      },
      prisma,
      isLocalAdminJsDev: true,
      config: adminjsConfig,
    }),
  );

  app.listen(adminjsConfig.devPort, () => {
    // eslint-disable-next-line no-console
    console.log(`AdminJS started on http://localhost:${adminjsConfig.devPort}${rootPath}`);
  });
};

start();
