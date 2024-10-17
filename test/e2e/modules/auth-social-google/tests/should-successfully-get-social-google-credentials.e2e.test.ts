import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AuthSocialGoogleCredentialsDto } from '~modules/auth-social-google/dtos/auth-social-google.credentials.dto';

import { socialProviderGooglePublicCredentialsStub } from '../../../../stubs/social-provider-google.stub';
import { e2eMockSocialGoogleSpyOnGetAuthenticationCredentials } from '../../../mocks/social-google.e2e.mock';

export async function __e2eShouldSuccessfullyGetSocialGoogleCredentials(app: INestApplication): Promise<void> {
  const spyGetAuthenticationCredentials = e2eMockSocialGoogleSpyOnGetAuthenticationCredentials(app);

  const response = await request(app.getHttpServer()).get('/auth-social-google/credentials');

  expect(response.statusCode).toBe(HttpStatus.OK);
  expect(spyGetAuthenticationCredentials).toHaveBeenCalledTimes(1);
  expect(spyGetAuthenticationCredentials).toHaveReturnedTimes(1);

  const googleCredentials = response.body as AuthSocialGoogleCredentialsDto;

  expect(googleCredentials.baseUrl).toStrictEqual(socialProviderGooglePublicCredentialsStub.baseUrl);
  expect(googleCredentials.clientId).toStrictEqual(socialProviderGooglePublicCredentialsStub.clientId);
  expect(googleCredentials.responseType).toStrictEqual(socialProviderGooglePublicCredentialsStub.responseType);
  expect(googleCredentials.scopes).toStrictEqual(socialProviderGooglePublicCredentialsStub.scopes);
}
