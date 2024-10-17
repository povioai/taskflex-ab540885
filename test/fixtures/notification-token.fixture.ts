import { INestApplication } from '@nestjs/common';
import { PushNotificationToken } from '@prisma/client';

import { PrismaService } from '~database/prisma';

import { testGenerateRandomFcmToken } from '../utils/generate-random-fcm-token.test.util';

export class NotificationTokenFixture {
  static async createUserNotificationToken(app: INestApplication, userId: string): Promise<PushNotificationToken> {
    const prisma = app.get<PrismaService>(PrismaService);

    const token = testGenerateRandomFcmToken();
    const notificationToken = await prisma.client.pushNotificationToken.create({ data: { userId, token } });

    return notificationToken;
  }
}
