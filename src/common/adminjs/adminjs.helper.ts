import { INestApplication } from '@nestjs/common';
import * as PrismaModule from '@prisma/client';
import { PrismaClient } from '@prisma/client';

import { AuthManagedCustomProviderEmailPasswordService } from '~vendors/auth-managed-custom-provider-email-password/auth-managed-custom-provider-email-password.service';

import { getConfig } from '~common/config';

import { PrismaConfig } from '~database/prisma';

import { AdminJSConfig } from './adminjs.config';

/**
 * Setup AdminJS Configuration
 * @param app
 */
export async function adminjsSetup(app: INestApplication): Promise<void> {
  const adminConfig = getConfig(AdminJSConfig);

  if (!adminConfig.enabled) {
    return;
  }

  const prismaConfig = getConfig(PrismaConfig);
  const prisma = new PrismaModule.PrismaClient({ datasources: { db: { url: prismaConfig.databaseUrl } } });
  const authManagedCustomProviderEmailPasswordService = app.get(AuthManagedCustomProviderEmailPasswordService);

  await upsertAdminUser(prisma, adminConfig, authManagedCustomProviderEmailPasswordService);

  const rootPath = adminConfig.path ? `/${adminConfig.path}` : '/admin';

  const adminjsExpress = await import('adminjs-express');

  app.use(
    rootPath,
    await adminjsExpress.adminRouter({
      rootPath,
      dbUrl: prismaConfig.databaseUrl,
      authenticate: async (email: string, password: string): Promise<{ email: string; password: string } | null> => {
        const user = await prisma.superAdmin.findFirst({ where: { email } });

        if (!user) {
          return null;
        }

        const correctPassword = await authManagedCustomProviderEmailPasswordService.encryptComparePassword(
          password,
          user.password!,
        );
        if (!correctPassword) {
          return null;
        }
        return Promise.resolve({ email: user.email, password: user.password });
      },
      prisma,
      config: adminConfig,
    }),
  );
}

async function upsertAdminUser(
  prisma: PrismaClient,
  adminJSConfig: AdminJSConfig,
  authCryptService: AuthManagedCustomProviderEmailPasswordService,
) {
  await prisma.superAdmin.upsert({
    where: {
      email: adminJSConfig.email,
    },
    create: {
      email: adminJSConfig.email,
      password: await authCryptService.encryptPassword(adminJSConfig.password),
    },
    update: {
      password: await authCryptService.encryptPassword(adminJSConfig.password),
    },
  });
}
