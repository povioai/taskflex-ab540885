import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AuthLoginDto } from '~modules/auth/dtos/auth.login.dto';

import { UserFixture } from '../../../../fixtures/user.fixture';

export async function __e2eShouldFailLoginBecauseInvalidPassword(app: INestApplication): Promise<void> {
  const email = 'auth.login.error.badRequest.invalidPassword@example.com';
  const password = '.Password1';

  await UserFixture.createUser(app, email, password);

  const body: AuthLoginDto = {
    email,
    password: '.invalidPassword1',
  };

  const response = await request(app.getHttpServer()).post('/auth/login').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
