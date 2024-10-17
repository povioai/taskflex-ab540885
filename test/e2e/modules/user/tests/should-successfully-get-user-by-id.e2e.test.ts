import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UserDto } from '~modules/user/dtos/user.dto';

import { UserFixture } from '../../../../fixtures/user.fixture';

export async function __e2eShouldSuccessfullyGetUserById(app: INestApplication): Promise<void> {
  const email1 = 'user-me.get.success2@example.com';
  const user1 = await UserFixture.createUser(app, email1);
  const accessToken = await UserFixture.createUserAccessToken(app, user1.id);

  const email = 'user.get.success1@example.com';
  const user = await UserFixture.createUser(app, email);

  const response = await request(app.getHttpServer()).get(`/users/${user.id}`).auth(accessToken, { type: 'bearer' });

  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.body as UserDto;

  expect(responseBody.id).toStrictEqual(user.id);
  expect(responseBody.email).toStrictEqual(email);
}
