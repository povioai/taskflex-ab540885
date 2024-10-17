import AdminJSExpress from '@adminjs/express';
import { Database as PrismaAdapterDatabase, getModelByName, Resource as PrismaAdapterResource } from '@adminjs/prisma';
import { Adapter, Database as SqlAdapterDatabase, Resource as SqlAdapterResource } from '@adminjs/sql';
import { dark, light } from '@adminjs/themes';
import { PrismaClient } from '@prisma/client';
import AdminJS, { ComponentLoader, PageContext } from 'adminjs';
import { Request, Response, Router } from 'express';
import session from 'express-session';
import fileStore from 'session-file-store';

import { IAdminJSConfig } from './interfaces/adminjs.config.interface.js';
import { QUEUE_PAGE_NAME } from './pages/Queue/QueuePage.js';

interface IAdminUser {
  email: string;
  password: string;
}

type Page = {
  handler: (request: Request, response: Response, context: PageContext) => Promise<any>;
  component: string;
  icon?: string;
};
type Pages = {
  [key: string]: Page;
};

type AdminRouterArgs = {
  rootPath: string;
  dbUrl: string;
  authenticate: (email: string, password: string) => Promise<IAdminUser | null>;
  prisma: PrismaClient;
  isLocalAdminJsDev?: boolean;
  config: IAdminJSConfig;
};

AdminJS.registerAdapter({
  Resource: PrismaAdapterResource,
  Database: PrismaAdapterDatabase,
});

AdminJS.registerAdapter({
  Resource: SqlAdapterResource,
  Database: SqlAdapterDatabase,
});

export async function adminRouter({
  rootPath,
  authenticate,
  dbUrl,
  prisma,
  isLocalAdminJsDev,
  config,
}: AdminRouterArgs): Promise<Router> {
  const router = Router();

  const pgbossDb = await new Adapter('postgresql', {
    connectionString: dbUrl,
    database: getDBNameFromUrlString(dbUrl),
    schema: 'pgboss',
  }).init();

  const sessionName = 'adminjs';
  const sessionSecret = 'adminjs';

  const loginSubpath = '/login';
  const loginPath = `${rootPath}${loginSubpath}`;

  const logoutSubpath = '/logout';
  const logoutPath = `${rootPath}${logoutSubpath}`;

  // component loader
  const componentLoader = new ComponentLoader();

  // Here you need to define what resources/tables you want to expose to AdminJS
  const exposedEntities = ['Media'];

  const adminJs = new AdminJS({
    rootPath,
    loginPath,
    logoutPath,
    defaultTheme: 'light',
    availableThemes: [light, dark],
    branding: { withMadeWithLove: false },
    componentLoader,
    pages: getPages(componentLoader, config),
    resources: [
      ...exposedEntities.map((entity) => {
        return {
          model: getModelByName(entity),
          client: prisma,
        };
      }),
      {
        model: getModelByName('User'),
        client: prisma,
        options: {
          // TODO provide UI component for user's role selection if role remains an array of strings in Prisma DB Schema
          properties: {
            roles: {
              type: 'mixed',
              isArray: true,
              subType: 'string',
              availableValues: [
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
              ],
            },
          },
        },
      },
      {
        resource: pgbossDb.table('job'),
        options: {
          navigation: false,
          properties: {
            state: {
              type: 'enum',
              availableValues: [
                { value: 'created', label: 'Created' },
                { value: 'retry', label: 'Retry' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'expired', label: 'Expired' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'failed', label: 'Failed' },
              ],
            },
          },
        },
      },
    ],
  });

  adminJs.watch();

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: sessionName,
      cookiePassword: sessionSecret,
    },
    undefined,
    {
      name: sessionName,
      secret: sessionSecret,
      saveUninitialized: true,
      resave: true,
    },
  );

  router.use(
    session({
      name: sessionName,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: getSessionStore(isLocalAdminJsDev),
    }),
    adminRouter,
  );

  return router;
}

function getDBNameFromUrlString(dbUrl: string) {
  const dbName = dbUrl.split('/').pop();

  if (!dbName) {
    throw new Error('Database name not found in URL');
  }

  return dbName;
}

function getPages(componentLoader: ComponentLoader, config: IAdminJSConfig): Pages {
  return {
    [`${QUEUE_PAGE_NAME}`]: {
      handler: async () => {
        // This is how you pass initial props to a component that is type of "AdminJSPage" (sort of hydration).
        return config.pgBossQueues;
      },
      component: componentLoader.add('QueuePage', './pages/Queue/QueuePage'),
    },
  };
}

function getSessionStore(isLocalAdminJsDev?: boolean) {
  if (!isLocalAdminJsDev) {
    // use the default in-memory session store
    return undefined;
  }
  const SessionFileStore = fileStore(session);

  const fileStoreOptions = {
    path: './.sessions',
    ttl: 86400, // 1 day
    retries: 0,
  };

  return new SessionFileStore(fileStoreOptions);
}
