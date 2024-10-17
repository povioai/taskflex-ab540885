import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { MediaPresignedUrlPostDto } from '~modules/media-presigned-url/dtos/media-presigned-url.post.dto';

import { UserFixture } from '../../../../fixtures/user.fixture';

export async function __e2eShouldFailCreatePresignedUrlBecauseMediaUseNotValid(app: INestApplication): Promise<void> {
  const email = 'media-presigned-url.create.fail.mediaNotValid@example.com';
  const password = '.Password1';
  const user = await UserFixture.createUser(app, email, password);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const body: MediaPresignedUrlPostDto = {
    use: 'invalidMedia#123<' as any,
  };

  const response = await request(app.getHttpServer())
    .post('/media-presigned-url')
    .auth(accessToken, { type: 'bearer' })
    .send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
