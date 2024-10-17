import { INestApplication } from '@nestjs/common';

import { createTestingApp } from '../../../helpers';
import { __e2eShouldFailGetMyUserInfoBecauseNotAuthorized } from './tests/should-fail-get-my-user-info-because-not-authorized.e2e.test';
import { __e2eShouldFailUpdatingMyUserInfoBecauseNotAuthorized } from './tests/should-fail-updating-my-user-because-not-authorized.e2e.test';
import { __e2eShouldSuccessfullyGetMeAsUser } from './tests/should-successfully-get-me-as-user.e2e.test';
import { __e2eShouldSuccessfullyUpdateMeAsUser } from './tests/should-successfully-update-me-as-user.e2e.test';

describe('user-me', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  describe('User requests', () => {
    describe('GET /user-me', () => {
      it('Should successfully get me as user', async () => {
        await __e2eShouldSuccessfullyGetMeAsUser(app);
      });

      it('Should fail get my user info because not authorized', async () => {
        await __e2eShouldFailGetMyUserInfoBecauseNotAuthorized(app);
      });
    });
  });

  describe('PUT /user-me', () => {
    it('Should successfully update me as user', async () => {
      await __e2eShouldSuccessfullyUpdateMeAsUser(app);
    });

    it('Should fail updating my user info because not authorized', async () => {
      await __e2eShouldFailUpdatingMyUserInfoBecauseNotAuthorized(app);
    });
  });
});
