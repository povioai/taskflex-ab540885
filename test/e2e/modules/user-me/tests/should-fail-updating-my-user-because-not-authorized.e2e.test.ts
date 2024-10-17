import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

export async function __e2eShouldFailUpdatingMyUserInfoBecauseNotAuthorized(app: INestApplication): Promise<void> {
  const response = await request(app.getHttpServer()).put('/users/me').send({
    email: 'sometestemail@example.com',
  });

  expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
}
