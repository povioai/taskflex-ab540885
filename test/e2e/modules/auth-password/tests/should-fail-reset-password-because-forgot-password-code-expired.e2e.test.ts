import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AuthPasswordResetDto } from '~modules/auth-password/dtos/auth-password.reset.dto';

import { PasswordForgotFixture } from '../../../../fixtures/password-forgot.fixture';
import { UserFixture } from '../../../../fixtures/user.fixture';
import { testGenerateRandomForgotPasswordCode } from '../../../../utils/generate-random-forgot-password-code.test.util';

export async function __e2eShouldFailResetPasswordBecauseForgotPasswordCodeExpired(
  app: INestApplication,
): Promise<void> {
  const email = 'auth-password.reset.fail.forgotPasswordCodeExpired@example.com';
  const code = testGenerateRandomForgotPasswordCode();

  const user = await UserFixture.createUser(app, email);
  await PasswordForgotFixture.createExpiredCode(app, user.id, code);

  const body: AuthPasswordResetDto = {
    code,
    newPassword: '.Password1',
  };

  const response = await request(app.getHttpServer()).post('/auth-password/reset').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
