import { MiddlewareConsumer, Module } from '@nestjs/common';

import { QueueSystemModule } from '~vendors/queue-system/queue-system.module';

import { getConfigFactory } from '~common/config';
import { CoreConfig } from '~common/core';
import { HttpHealthModule } from '~common/http/health';
import { LoggerModule } from '~common/logging';

import { PrismaModule } from '~database/prisma';

import { AuthPasswordModule } from '~modules/auth-password/auth-password.module';
import { AuthSocialGoogleModule } from '~modules/auth-social-google/auth-social-google.module';
import { AuthModule } from '~modules/auth/auth.module';
import { AuthenticationMiddleware } from '~modules/auth/middlewares/authentication.middleware';
import { EmailModule } from '~modules/email/email.module';
import { MediaPresignedUrlModule } from '~modules/media-presigned-url/media-presigned-url.module';
import { PushNotificationTokenModule } from '~modules/push-notification-token/push-notification-token.module';
import { PushNotificationModule } from '~modules/push-notification/push-notification.module';
import { TaskManagementModule } from '~modules/task-management/task-management.module';
import { UserIdentityProviderModule } from '~modules/user-identity-provider/user-identity-provider.module';
import { UserSessionModule } from '~modules/user-session/user-session.module';
import { UserModule } from '~modules/user/user.module';
import { UtilityAuthSocialGoogleModule } from '~modules/utility-auth-social-google/utility-auth-social-google.module';
import { WebhookMediaValidationModule } from '~modules/webhook-media-validation/webhook-media-validation.module';

@Module({
  imports: [
    // global modules
    PrismaModule,
    LoggerModule,
    HttpHealthModule,
    EmailModule,
    PushNotificationModule,

    // authentication
    UserIdentityProviderModule,
    AuthModule,
    AuthPasswordModule.forRootOptionalAsync(),
    AuthSocialGoogleModule,

    // controller-based modules
    UserModule,
    UserSessionModule,
    PushNotificationTokenModule,
    MediaPresignedUrlModule,
    TaskManagementModule,

    // utility
    UtilityAuthSocialGoogleModule.forRoot(),

    // webhooks
    WebhookMediaValidationModule.forRootOptionalAsync(),

    // Queue system
    QueueSystemModule,
  ],
  controllers: [],
  providers: [getConfigFactory(CoreConfig)],
  exports: [CoreConfig],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply().forRoutes().apply(AuthenticationMiddleware).forRoutes('*');
  }
}
