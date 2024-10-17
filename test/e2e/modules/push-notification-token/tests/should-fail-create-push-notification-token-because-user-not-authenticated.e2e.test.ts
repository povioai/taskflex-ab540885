import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { PushNotificationTokenPostDto } from '~modules/push-notification-token/dtos/push-notification-token.post.dto';

import { testGenerateRandomFcmToken } from '../../../../utils/generate-random-fcm-token.test.util';

export async function __e2eShouldFailCreatePushNotificationTokenBecauseUserNotAuthenticated(
  app: INestApplication,
): Promise<void> {
  const token = testGenerateRandomFcmToken();
  const body: PushNotificationTokenPostDto = {
    token,
  };

  const response = await request(app.getHttpServer()).post('/push-notification-token').send(body);

  expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
}
