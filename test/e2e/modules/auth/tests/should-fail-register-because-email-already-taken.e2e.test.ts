import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AuthRegisterDto } from '~modules/auth/dtos/auth.register.dto';

import { UserFixture } from '../../../../fixtures/user.fixture';

export async function __e2eShouldFailRegisterBecauseEmailAlreadyTaken(app: INestApplication): Promise<void> {
  const email = 'auth.register.error.forbidden.emailAlreadyTaken@example.com';
  const password = '.Password1';

  await UserFixture.createUser(app, email);

  const body: Partial<AuthRegisterDto> = {
    email,
    password,
  };

  const response = await request(app.getHttpServer()).post('/auth/register').send(body);

  expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
}
