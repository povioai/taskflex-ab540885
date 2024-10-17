import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AuthSocialGoogleCallbackQuery } from '~modules/auth-social-google/queries/auth-social-google.callback.query';
import { UserIdentityProviderIntegration } from '~modules/user-identity-provider/enums/user-identity-provider.integration.enum';
import { makeUUID } from '~vendors/short-uuid';

import { RefreshTokenFixture } from '../../../../fixtures/refresh-token.fixture';
import { UserIdentityProviderFixture } from '../../../../fixtures/user-identity-provider.fixture';
import { UserSessionFixture } from '../../../../fixtures/user-session.fixture';
import { UserFixture } from '../../../../fixtures/user.fixture';
import { e2eMockSocialGoogleSpyOnGetUserEmail } from '../../../mocks/social-google.e2e.mock';

export async function __e2eShouldSuccessfullyPassThroughExistingUserOnGoogleCallback(
  app: INestApplication,
): Promise<void> {
  const sub = makeUUID();
  const email = 'auth-social-google.callback.success.passThroughExistingUser@example.com';
  const emailVerified = true;

  const user = await UserFixture.createUserWithoutProvider(app, email);
  await UserIdentityProviderFixture.createForUser(app, user.id, sub, UserIdentityProviderIntegration.GOOGLE);

  const spyGetAuthenticationCredentials = e2eMockSocialGoogleSpyOnGetUserEmail(app).mockImplementationOnce(async () => {
    return { sub, email, emailVerified };
  });

  const query: AuthSocialGoogleCallbackQuery = {
    code: 'test-code',
    redirectUri: 'http://example.com',
  };

  const response = await request(app.getHttpServer()).get('/auth-social-google/callback').query(query);

  expect(response.statusCode).toBe(HttpStatus.OK);
  expect(spyGetAuthenticationCredentials).toHaveBeenCalledTimes(1);
  expect(spyGetAuthenticationCredentials).toHaveReturnedTimes(1);

  const provider = await UserIdentityProviderFixture.findForUser(app, user.id, UserIdentityProviderIntegration.GOOGLE);

  expect(provider.emailVerified).toStrictEqual(emailVerified);
  expect(provider.sub).toStrictEqual(sub);

  const userSessions = await UserSessionFixture.findManyByUserId(app, user.id);
  const refreshTokens = await RefreshTokenFixture.findManyByUserId(app, user.id);

  expect(userSessions.length).toStrictEqual(1);
  expect(refreshTokens.length).toStrictEqual(1);
}
