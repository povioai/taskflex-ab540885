import { SendEmailCommand, SendEmailCommandInput, SESClient, SESClientConfig } from '@aws-sdk/client-ses';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { EmailProviderService } from '~vendors/email-provider/email-provider.service';

import { LoggerService } from '~common/logging';

import { EmailProviderAwsSesConfig } from './email-provider-aws-ses.config';

@Injectable()
export class EmailProviderAwsSesService extends EmailProviderService {
  constructor(
    private readonly emailProviderAwsSesConfig: EmailProviderAwsSesConfig,
    private readonly logger: LoggerService,
  ) {
    super();

    const configuration: SESClientConfig = {
      region: emailProviderAwsSesConfig.region,
    };

    if (emailProviderAwsSesConfig.accessKeyId && emailProviderAwsSesConfig.secretAccessKey) {
      configuration.credentials = {
        accessKeyId: emailProviderAwsSesConfig.accessKeyId,
        secretAccessKey: emailProviderAwsSesConfig.secretAccessKey,
      };
    }

    if (emailProviderAwsSesConfig.apiEndpoint) {
      configuration.endpoint = emailProviderAwsSesConfig.apiEndpoint;
    }

    this.client = new SESClient(configuration);
  }

  private readonly client: SESClient;

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

    const params: SendEmailCommandInput = {
      Source: this.emailProviderAwsSesConfig.emailFrom,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: { Data: compiledSubject },
        Body: {
          Html: { Data: compiledHtmlContent },
          Text: { Data: compiledTextContent },
        },
      },
    };

    const command = new SendEmailCommand(params);

    try {
      await this.client.send(command);
    } catch (error) {
      this.logger.error(`Error sending templated email: ${JSON.stringify(error)}.`);
      throw new InternalServerErrorException();
    }
  }
}
