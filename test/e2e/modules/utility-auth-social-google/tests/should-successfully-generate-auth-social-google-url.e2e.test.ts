import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { socialProviderGooglePublicCredentialsStub } from '../../../../stubs/social-provider-google.stub';
import { e2eMockSocialGoogleSpyOnGetAuthenticationCredentials } from '../../../mocks/social-google.e2e.mock';

export async function __e2eShouldSuccessfullyGenerateAuthSocialGoogleUrl(app: INestApplication): Promise<void> {
  const spyGetAuthenticationCredentials = e2eMockSocialGoogleSpyOnGetAuthenticationCredentials(app);

  const response = await request(app.getHttpServer()).get(`/utility-auth-social-google/generate`);
  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.text as string;

  expect(spyGetAuthenticationCredentials).toHaveBeenCalledTimes(1);
  expect(spyGetAuthenticationCredentials).toHaveReturnedTimes(1);
  expect(responseBody).toBeTruthy();

  const hasClient = responseBody.includes(socialProviderGooglePublicCredentialsStub.clientId as string);
  const hasResponseType = responseBody.includes(socialProviderGooglePublicCredentialsStub.responseType as string);

  expect(hasClient).toStrictEqual(true);
  expect(hasResponseType).toStrictEqual(true);
}
