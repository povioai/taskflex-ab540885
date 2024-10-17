import { IAuthAccessToken } from './auth.access-token.interface';

export interface IBearerAuthenticatedUser {
  id: string;
  accessToken: string;
  tokenPayload: IAuthAccessToken;
  userIdentityProviderId: string;
  userSessionId: string;
}
