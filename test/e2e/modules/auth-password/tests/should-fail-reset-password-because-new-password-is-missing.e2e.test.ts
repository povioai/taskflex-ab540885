import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AuthPasswordResetDto } from '~modules/auth-password/dtos/auth-password.reset.dto';

import { testGenerateRandomForgotPasswordCode } from '../../../../utils/generate-random-forgot-password-code.test.util';

export async function __e2eShouldFailResetPasswordBecauseNewPasswordIsMissing(app: INestApplication): Promise<void> {
  const code = testGenerateRandomForgotPasswordCode();

  const body: Partial<AuthPasswordResetDto> = {
    code,
  };

  const response = await request(app.getHttpServer()).post('/auth-password/reset').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
