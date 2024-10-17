import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UserDto } from '~modules/user/dtos/user.dto';

import { UserFixture } from '../../../../fixtures/user.fixture';

export async function __e2eShouldSuccessfullyGetMeAsUser(app: INestApplication): Promise<void> {
  const email = 'user-me.get.success6@example.com';

  const user = await UserFixture.createUser(app, email);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const response = await request(app.getHttpServer()).get('/users/me').auth(accessToken, { type: 'bearer' });

  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.body as UserDto;

  expect(responseBody.email).toStrictEqual(email);
  expect(responseBody.email).toStrictEqual(user.email);
  expect(responseBody.id).toStrictEqual(user.id);
}
