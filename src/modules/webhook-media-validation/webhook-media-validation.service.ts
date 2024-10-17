import { Injectable } from '@nestjs/common';

import { LoggerService } from '~common/logging';

import { MediaValidationService } from '~modules/media-validation/media-validation.service';

import { IWebhookMediaValidationCallback } from './interfaces/webhook-media-validation.callback.interface';

@Injectable()
export class WebhookMediaValidationService {
  constructor(
    private readonly logger: LoggerService,
    private readonly mediaValidationService: MediaValidationService,
  ) {}

  async uploadedMediaCallback(data: IWebhookMediaValidationCallback): Promise<void> {
    const { objectKey } = data;

    try {
      await this.mediaValidationService.validateByObjectKey(objectKey);
    } catch (err) {
      this.logger.warn(`Error occurred validation media in callback: `, err);
    }
  }
}
