import { createMock } from '@golevelup/ts-jest';
import { INestApplication } from '@nestjs/common';

import { AuthManagedSocialProviderFacebookService } from '~vendors/auth-managed-social-provider-facebook/auth-managed-social-provider-facebook.service';

import { socialProviderFacebookPublicCredentialsStub } from '../../stubs/social-provider-facebook.stub';
import { ITestNestSetupProviderOverride } from '../interfaces/nest-setup.test.provider-override.interface';

export const e2eMockSocialFacebook: ITestNestSetupProviderOverride[] = [
  {
    typeOrToken: AuthManagedSocialProviderFacebookService,
    value: createMock<AuthManagedSocialProviderFacebookService>({
      getAuthenticationCredentials: jest.fn().mockReturnValue(socialProviderFacebookPublicCredentialsStub),
    }),
  },
];

export function e2eMockSocialFacebookClear(app: INestApplication): void {
  const authManagedSocialProviderFacebookService = app.get(AuthManagedSocialProviderFacebookService);
  jest.spyOn(authManagedSocialProviderFacebookService, 'getAuthenticationCredentials').mockClear();
  jest.spyOn(authManagedSocialProviderFacebookService, 'getAccessTokenUsingCode').mockClear();
  jest.spyOn(authManagedSocialProviderFacebookService, 'getUserEmail').mockClear();
}

export function e2eMockSocialFacebookSpyOnGetAuthenticationCredentials(app: INestApplication) {
  const authManagedSocialProviderFacebookService = app.get(AuthManagedSocialProviderFacebookService);
  return jest.spyOn(authManagedSocialProviderFacebookService, 'getAuthenticationCredentials');
}

export function e2eMockSocialFacebookSpyOnGetUserEmail(app: INestApplication) {
  const authManagedSocialProviderFacebookService = app.get(AuthManagedSocialProviderFacebookService);
  return jest.spyOn(authManagedSocialProviderFacebookService, 'getUserEmail');
}
