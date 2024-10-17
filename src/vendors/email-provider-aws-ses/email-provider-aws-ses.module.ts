import { DynamicModule, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import { EmailProviderAwsSesConfig, IEmailProviderAwsSesConfig } from './email-provider-aws-ses.config';
import { EmailProviderAwsSesService } from './email-provider-aws-ses.service';

@Module({})
export class EmailProviderAwsSesModule {
  static forRoot(config: IEmailProviderAwsSesConfig): DynamicModule {
    return {
      module: EmailProviderAwsSesModule,
      providers: [plainToValidatedInstanceProvider(EmailProviderAwsSesConfig, config), EmailProviderAwsSesService],
      exports: [EmailProviderAwsSesService],
    };
  }
}
