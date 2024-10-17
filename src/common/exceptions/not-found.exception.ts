import { HttpStatus } from '@nestjs/common';

import { BaseException } from '~common/exceptions/base.exception';

export class NotFoundException extends BaseException {
  constructor(message: string, code: string, status = HttpStatus.NOT_FOUND) {
    super(message, { httpStatus: status, code });
  }
}
