import { Injectable, NestMiddleware } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { NextFunction, Response } from 'express';
import { DateTime } from 'luxon';

import { UnauthorizedException } from '~common/exceptions';
import { LoggerService } from '~common/logging';

import { UserSessionService } from '~modules/user-session/user-session.service';

import { AuthService } from '../auth.service';
import { IAuthAccessToken } from '../interfaces/auth.access-token.interface';
import { AuthenticatedRequest } from '../requests/authenticated.request';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
    private readonly userSessionService: UserSessionService,
  ) {}

  async use(request: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> {
    const header = request.header('Authorization');

    if (!header) {
      return next();
    }

    const headerParts = header.split(' ');
    if (headerParts.length !== 2 || headerParts[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Unauthorized', 'AUTH_UNAUTHORIZED');
    }

    const accessToken = headerParts[1];

    let payload: IAuthAccessToken;
    try {
      payload = await this.authService.verifyToken(accessToken);
    } catch (err) {
      this.logger.error('Error occurred verifying access token. Err: ', err);
      throw new UnauthorizedException('Unauthorized', 'AUTH_UNAUTHORIZED');
    }

    const { sub: userId, jti } = payload;

    const userSession = await this.userSessionService.findForUserByJti(userId, jti);
    if (!userSession) {
      throw new UnauthorizedException('Invalid user session.', 'AUTH_UNAUTHORIZED');
    }

    const now = DateTime.now().toJSDate();
    const timeDiff = now.getTime() - userSession.expireAt.getTime();
    const isSessionExpired = timeDiff > 0;
    if (isSessionExpired) {
      throw new UnauthorizedException('User session expired.', 'AUTH_UNAUTHORIZED');
    }

    Sentry.setUser({
      id: userId,
      ip_address: request.ip,
    });

    request.authenticatedBearerUser = {
      id: userId,
      accessToken,
      tokenPayload: payload,
      userIdentityProviderId: userSession.userIdentityProviderId,
      userSessionId: userSession.id,
    };

    request.authenticatedUser = {
      id: userId,
    };

    return next();
  }
}
