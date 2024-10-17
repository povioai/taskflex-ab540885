import { DynamicModule, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import { IOpenidClientAuth0Config, OpenidClientAuth0Config } from './openid-client-auth0.config';
import { OpenidClientAuth0Service } from './openid-client-auth0.service';

@Module({})
export class OpenidClientAuth0Module {
  static forRoot(config: IOpenidClientAuth0Config): DynamicModule {
    return {
      module: OpenidClientAuth0Module,
      providers: [plainToValidatedInstanceProvider(OpenidClientAuth0Config, config), OpenidClientAuth0Service],
      exports: [OpenidClientAuth0Service],
    };
  }
}
