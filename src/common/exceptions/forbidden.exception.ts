import { HttpStatus } from '@nestjs/common';

import { BaseException } from '~common/exceptions/base.exception';

export class ForbiddenException extends BaseException {
  constructor(message: string, code: string, status = HttpStatus.FORBIDDEN) {
    super(message, { httpStatus: status, code });
  }
}
