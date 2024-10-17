import { INestApplication } from '@nestjs/common';
import { UserIdentityProvider } from '@prisma/client';

import { PrismaService } from '~database/prisma';

import { UserIdentityProviderIntegration } from '~modules/user-identity-provider/enums/user-identity-provider.integration.enum';

export class UserIdentityProviderFixture {
  static async findForUser(
    app: INestApplication,
    userId: string,
    integration: UserIdentityProviderIntegration,
  ): Promise<UserIdentityProvider> {
    const prisma = app.get<PrismaService>(PrismaService);

    const userIdentityProvider = await prisma.client.userIdentityProvider.findFirstOrThrow({
      where: { userId, integration, source: null },
    });

    return userIdentityProvider;
  }

  static async createForUser(
    app: INestApplication,
    userId: string,
    sub: string,
    integration?: UserIdentityProviderIntegration,
  ): Promise<UserIdentityProvider> {
    const prisma = app.get<PrismaService>(PrismaService);

    const userIdentityProvider = await prisma.client.userIdentityProvider.create({
      data: { userId, sub, integration, source: null },
    });

    return userIdentityProvider;
  }
}
