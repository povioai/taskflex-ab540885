import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailDataRequired, MailService } from '@sendgrid/mail';

import { EmailProviderService } from '~vendors/email-provider/email-provider.service';

import { LoggerService } from '~common/logging';

import { EmailProviderSendgridConfig } from './email-provider-sendgrid.config';

@Injectable()
export class EmailProviderSendgridService extends EmailProviderService {
  constructor(
    private readonly emailProviderSendgridConfig: EmailProviderSendgridConfig,
    private readonly logger: LoggerService,
    private readonly mailService: MailService,
  ) {
    super();

    const apiKey = emailProviderSendgridConfig.apiKey;
    this.mailService.setApiKey(apiKey);
  }

  async sendEmail(
    email: string,
    subject: string,
    htmlContent: string,
    templateVars: Record<string, any>,
    textContent?: string,
  ): Promise<void> {
    const compiledSubject = this.compileEmailContent(subject, templateVars);
    const compiledHtmlContent = this.compileEmailContent(htmlContent, templateVars);

    let compiledTextContent: string | undefined;
    if (textContent) {
      compiledTextContent = this.compileEmailContent(textContent, templateVars);
    }

    const message: MailDataRequired = {
      from: this.emailProviderSendgridConfig.emailFrom,
      to: email,
      subject: compiledSubject,
      text: compiledTextContent,
      html: compiledHtmlContent,
    };

    try {
      await this.mailService.send(message);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
