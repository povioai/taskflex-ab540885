import { Module } from '@nestjs/common';

import { EmailTemplateVersionRepository } from './email-template-version.repository';
import { EmailTemplateVersionService } from './email-template-version.service';

@Module({
  providers: [EmailTemplateVersionRepository, EmailTemplateVersionService],
  exports: [EmailTemplateVersionService],
})
export class EmailTemplateVersionModule {}
