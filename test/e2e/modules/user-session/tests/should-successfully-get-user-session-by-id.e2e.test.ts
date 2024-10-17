import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UserSessionDto } from '~modules/user-session/dtos/user-session.dto';

import { UserSessionFixture } from '../../../../fixtures/user-session.fixture';
import { UserFixture } from '../../../../fixtures/user.fixture';

export async function __e2eShouldSuccessfullyGetUserSessionById(app: INestApplication): Promise<void> {
  const email = 'user-session.get.success@example.com';

  const user = await UserFixture.createUser(app, email);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const userSessions = await UserSessionFixture.findManyByUserId(app, user.id);
  const userSessionId = userSessions[0].id;

  const response = await request(app.getHttpServer())
    .get(`/user-session/${userSessionId}`)
    .auth(accessToken, { type: 'bearer' });

  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.body as UserSessionDto;

  expect(responseBody.id).toStrictEqual(userSessionId);
}
