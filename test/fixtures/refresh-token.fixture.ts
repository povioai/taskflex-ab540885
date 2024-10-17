import { INestApplication } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';

import { PrismaService } from '~database/prisma';

export class RefreshTokenFixture {
  static async findManyByUserId(app: INestApplication, userId: string): Promise<RefreshToken[]> {
    const prisma = app.get<PrismaService>(PrismaService);

    const refreshTokens = await prisma.client.refreshToken.findMany({ where: { userId } });

    return refreshTokens;
  }

  static async findByToken(app: INestApplication, token: string): Promise<RefreshToken | undefined> {
    const prisma = app.get<PrismaService>(PrismaService);

    const refreshToken = await prisma.client.refreshToken.findUnique({ where: { token } });

    return refreshToken ?? undefined;
  }
}
