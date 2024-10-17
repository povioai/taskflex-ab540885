import { Module } from '@nestjs/common';

import { EmailTemplateVersionModule } from '~modules/email-template-version/email-template-version.module';

import { EmailTemplateRepository } from './email-template.repository';
import { EmailTemplateService } from './email-template.service';

@Module({
  imports: [EmailTemplateVersionModule],
  providers: [EmailTemplateRepository, EmailTemplateService],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule {}
