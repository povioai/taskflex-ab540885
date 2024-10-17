import { Global, Module } from '@nestjs/common';

import { getConfig } from '~common/config';
import { PushNotificationProviderFcmModule } from '~vendors/push-notification-provider-fcm/push-notification-provider-fcm.module';

import { PushNotificationTokenModule } from '~modules/push-notification-token/push-notification-token.module';

import { PushNotificationConfig } from './push-notification.config';
import { PushNotificationService } from './push-notification.service';

const pushNotificationConfig = getConfig(PushNotificationConfig);

@Global()
@Module({
  imports: [
    PushNotificationProviderFcmModule.forRoot({
      clientEmail: pushNotificationConfig?.clientEmail,
      privateKey: pushNotificationConfig?.privateKey,
      projectId: pushNotificationConfig?.projectId,
      setupRequired: pushNotificationConfig?.setupRequired,
    }),
    PushNotificationTokenModule,
  ],
  providers: [PushNotificationService],
  exports: [PushNotificationService],
})
export class PushNotificationModule {}
