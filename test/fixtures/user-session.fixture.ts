import { INestApplication } from '@nestjs/common';
import { UserSession } from '@prisma/client';
import { DateTime } from 'luxon';

import { PrismaService } from '~database/prisma';

export class UserSessionFixture {
  static async findManyByUserId(app: INestApplication, userId: string): Promise<UserSession[]> {
    const prisma = app.get<PrismaService>(PrismaService);

    const userSession = await prisma.client.userSession.findMany({ where: { userId } });

    return userSession;
  }

  static async expireUserSessionByJti(app: INestApplication, jti: string): Promise<UserSession> {
    const prisma = app.get<PrismaService>(PrismaService);

    const userSession = await prisma.client.userSession.update({
      where: { jti },
      data: {
        expireAt: DateTime.now().minus({ second: 1 }).toJSDate(),
      },
    });

    return userSession;
  }
}
