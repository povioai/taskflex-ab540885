import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthenticatedRequest } from '../requests/authenticated.request';

@Injectable()
export class AuthenticationWithApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    if (!this.validateIsAuthenticated(request) && !this.validateApiKey(request)) {
      throw new UnauthorizedException();
    }

    return true;
  }

  protected validateIsAuthenticated(request: AuthenticatedRequest): boolean {
    const isAuthenticated =
      request.authenticatedBearerUser?.accessToken && request.authenticatedBearerUser?.tokenPayload;
    return !!isAuthenticated;
  }

  protected validateApiKey(request: AuthenticatedRequest): boolean {
    const isAuthenticated = request.authenticatedApiKey?.apiKey && request.authenticatedApiKey?.userId;
    return !!isAuthenticated;
  }
}
