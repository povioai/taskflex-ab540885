import { DynamicModule, Module } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import { EmailProviderSendgridConfig, IEmailProviderSendgridConfig } from './email-provider-sendgrid.config';
import { EmailProviderSendgridService } from './email-provider-sendgrid.service';

@Module({})
export class EmailProviderSendgridModule {
  static forRoot(config: IEmailProviderSendgridConfig): DynamicModule {
    return {
      module: EmailProviderSendgridModule,
      providers: [
        plainToValidatedInstanceProvider(EmailProviderSendgridConfig, config),
        MailService,
        EmailProviderSendgridService,
      ],
      exports: [EmailProviderSendgridService],
    };
  }
}
