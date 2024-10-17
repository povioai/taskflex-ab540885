import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config';
import { TransformInputToBoolean } from '~vendors/class-validator';

@ConfigDecorator('webhookMediaValidation')
export class WebhookMediaValidationConfig {
  @Expose()
  @IsBoolean()
  @TransformInputToBoolean()
  enabled: boolean = false;

  @Expose()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  callbackHeaderAuthentication?: string;
}
