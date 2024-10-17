import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UserFixture } from '../../../../fixtures/user.fixture';
// import { UserFixture } from '../../../../fixtures/user.fixture';

export async function __e2eShouldFailGetUserByIdBecauseIdInvalidFormat(app: INestApplication): Promise<void> {
  const invalidFormatId = 'invalidId-format';

  const email = 'user-me.get.success1@example.com';
  const user = await UserFixture.createUser(app, email);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const response = await request(app.getHttpServer())
    .get(`/users/${invalidFormatId}`)
    .auth(accessToken, { type: 'bearer' });

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
