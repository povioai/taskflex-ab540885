import { createMock } from '@golevelup/ts-jest';
import { INestApplication } from '@nestjs/common';

import { EmailProviderAwsSesService } from '~vendors/email-provider-aws-ses/email-provider-aws-ses.service';

import { EmailTemplateVersionService } from '~modules/email-template-version/email-template-version.service';

import { ITestNestSetupProviderOverride } from '../../interfaces/nest-setup.test.provider-override.interface';
import { emailTemplateVersionHtmlStub } from '../../stubs/email-template-version.stub';

export const e2eMockEmail: ITestNestSetupProviderOverride[] = [
  { typeOrToken: EmailProviderAwsSesService, value: createMock<EmailProviderAwsSesService>({}) },
  {
    typeOrToken: EmailTemplateVersionService,
    value: createMock<EmailTemplateVersionService>({
      findByTypeOrThrow: jest.fn().mockReturnValue(emailTemplateVersionHtmlStub),
    }),
  },
];

export function e2eMockEmailClear(app: INestApplication): void {
  const emailProviderAwsSesService = app.get(EmailProviderAwsSesService);
  jest.spyOn(emailProviderAwsSesService, 'sendEmail').mockClear();
}

export function e2eMockEmailSpyOnSendEmail(app: INestApplication) {
  const emailProviderAwsSesService = app.get(EmailProviderAwsSesService);
  return jest.spyOn(emailProviderAwsSesService, 'sendEmail');
}
