import { HttpStatus } from '@nestjs/common';

import { BaseException } from '~common/exceptions/base.exception';

export class BadRequestException extends BaseException {
  constructor(message: string, code: string, status = HttpStatus.BAD_REQUEST) {
    super(message, { httpStatus: status, code: code });
  }
}
