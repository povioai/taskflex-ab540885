import { PushNotificationType } from './enums/push-notification.type.enum';
import { IPushNotificationMessageTemplate } from './interfaces/push-notification.message-template.interface';

// TODO: This can/should be moved into database and make it work similar to emails (store title, body, etc. in database instead of hardcoding it)
export const pushNotificationTemplates: {
  [key in PushNotificationType]: IPushNotificationMessageTemplate;
} = {
  EXAMPLE: { title: 'Ping', body: 'Pong' },
};
