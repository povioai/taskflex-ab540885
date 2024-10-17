import { Module } from '@nestjs/common';

import { PushNotificationTokenController } from './push-notification-token.controller';
import { PushNotificationTokenRepository } from './push-notification-token.repository';
import { PushNotificationTokenService } from './push-notification-token.service';

@Module({
  controllers: [PushNotificationTokenController],
  providers: [PushNotificationTokenRepository, PushNotificationTokenService],
  exports: [PushNotificationTokenService],
})
export class PushNotificationTokenModule {}
