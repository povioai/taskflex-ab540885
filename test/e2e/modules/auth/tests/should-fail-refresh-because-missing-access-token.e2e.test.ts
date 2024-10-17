import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AuthRefreshTokenDto } from '~modules/auth/dtos/auth.refresh-token.dto';

import { UserFixture } from '../../../../fixtures/user.fixture';

export async function __e2eShouldFailRefreshBecauseMissingAccessToken(app: INestApplication): Promise<void> {
  const refreshToken = await UserFixture.createRandomAccessToken();

  const refreshBody: Partial<AuthRefreshTokenDto> = {
    refreshToken,
  };

  const refreshResponse = await request(app.getHttpServer()).post('/auth/refresh').send(refreshBody);

  expect(refreshResponse.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
