import { Request } from 'express';

import { IAuthenticatedApiKey } from '../interfaces/authenticated-api-key.interface';
import { IAuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { IBearerAuthenticatedUser } from '../interfaces/bearer-authenticated-user.interface';

export interface AuthenticatedRequest extends Request {
  authenticatedBearerUser?: IBearerAuthenticatedUser;
  authenticatedApiKey?: IAuthenticatedApiKey;
  authenticatedUser?: IAuthenticatedUser;
}
