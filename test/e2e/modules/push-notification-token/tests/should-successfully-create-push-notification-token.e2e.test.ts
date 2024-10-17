import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { PushNotificationTokenDto } from '~modules/push-notification-token/dtos/push-notification-token.dto';
import { PushNotificationTokenPostDto } from '~modules/push-notification-token/dtos/push-notification-token.post.dto';

import { UserFixture } from '../../../../fixtures/user.fixture';
import { testGenerateRandomFcmToken } from '../../../../utils/generate-random-fcm-token.test.util';

export async function __e2eShouldSuccessfullyCreatePushNotificationToken(app: INestApplication): Promise<void> {
  const email = 'push-notification-token.create.success@example.com';
  const password = '.Password1';
  const user = await UserFixture.createUser(app, email, password);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const token = testGenerateRandomFcmToken();

  const body: PushNotificationTokenPostDto = {
    token,
  };

  const response = await request(app.getHttpServer())
    .post('/push-notification-token')
    .auth(accessToken, { type: 'bearer' })
    .send(body);

  expect(response.statusCode).toBe(HttpStatus.CREATED);

  const responseBody = response.body as PushNotificationTokenDto;

  expect(responseBody.token).toStrictEqual(token);
}
