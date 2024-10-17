import { DynamicModule, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import {
  IPushNotificationProviderFcmConfig,
  PushNotificationProviderFcmConfig,
} from './push-notification-provider-fcm.config';
import { PushNotificationProviderFcmService } from './push-notification-provider-fcm.service';

@Module({})
export class PushNotificationProviderFcmModule {
  static forRoot(config: IPushNotificationProviderFcmConfig): DynamicModule {
    return {
      module: PushNotificationProviderFcmModule,
      providers: [
        plainToValidatedInstanceProvider(PushNotificationProviderFcmConfig, config),
        PushNotificationProviderFcmService,
      ],
      exports: [PushNotificationProviderFcmService],
    };
  }
}
