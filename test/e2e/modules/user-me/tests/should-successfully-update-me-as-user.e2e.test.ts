import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UserDto } from '~modules/user/dtos/user.dto';

import { UserFixture } from '../../../../fixtures/user.fixture';

export async function __e2eShouldSuccessfullyUpdateMeAsUser(app: INestApplication): Promise<void> {
  const email = 'user-me.put.success@example.com';

  const user = await UserFixture.createUser(app, email);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const payload = {
    email: 'user-me.put.success@example.com',
  };
  const response = await request(app.getHttpServer())
    .put('/users/me')
    .auth(accessToken, { type: 'bearer' })
    .send(payload);

  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.body as UserDto;

  expect(responseBody.email).toStrictEqual(email);
  expect(responseBody.email).toStrictEqual(user.email);
  expect(responseBody.id).toStrictEqual(user.id);
}
