import { DynamicModule, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import {
  AwsCognitoClientIdentityProviderConfig,
  IAwsCognitoClientIdentityProviderConfig,
} from './aws-sdk-cognito-client-identity-provider.config';
import { AwsCognitoClientIdentityProviderService } from './aws-sdk-cognito-client-identity-provider.service';

@Module({})
export class AwsCognitoClientIdentityProviderModule {
  static forRoot(config: IAwsCognitoClientIdentityProviderConfig): DynamicModule {
    return {
      module: AwsCognitoClientIdentityProviderModule,
      providers: [
        plainToValidatedInstanceProvider(AwsCognitoClientIdentityProviderConfig, config),
        AwsCognitoClientIdentityProviderService,
      ],
      exports: [AwsCognitoClientIdentityProviderService],
    };
  }
}
