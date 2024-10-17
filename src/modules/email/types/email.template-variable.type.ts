/* eslint-disable @typescript-eslint/ban-types */

import { EmailType } from '../enums/email.type.enum';

export type EmailTemplateVariables = {
  [EmailType.FORGOT_PASSWORD]: {
    frontendUrl: string; // URL to frontend
    code: string; // Code for password reset
    expireAt: Date; // Expiration date of password reset
  };
  [EmailType.RESET_PASSWORD_SUCCESS]: {};
};
