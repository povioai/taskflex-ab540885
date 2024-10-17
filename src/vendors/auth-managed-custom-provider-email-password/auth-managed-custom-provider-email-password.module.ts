import { DynamicModule, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import { AuthManagedCustomProviderEmailPasswordConfig } from './auth-managed-custom-provider-email-password.config';
import { AuthManagedCustomProviderEmailPasswordService } from './auth-managed-custom-provider-email-password.service';

@Module({})
export class AuthManagedCustomProviderEmailPasswordModule {
  static forRoot(config: AuthManagedCustomProviderEmailPasswordConfig): DynamicModule {
    return {
      module: AuthManagedCustomProviderEmailPasswordModule,
      providers: [
        plainToValidatedInstanceProvider(AuthManagedCustomProviderEmailPasswordConfig, config),
        AuthManagedCustomProviderEmailPasswordService,
      ],
      exports: [AuthManagedCustomProviderEmailPasswordService],
    };
  }
}
