import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { makeUUID } from '~vendors/short-uuid';

import { UserFixture } from '../../../../fixtures/user.fixture';

export async function __e2eShouldFailGetUserSessionByIdBecauseSessionNotFound(app: INestApplication): Promise<void> {
  const email = 'user-session.get.fail.notFound@example.com';

  const user = await UserFixture.createUser(app, email);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const notFoundId = makeUUID();

  const response = await request(app.getHttpServer())
    .get(`/user-session/${notFoundId}`)
    .auth(accessToken, { type: 'bearer' });

  expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
}
