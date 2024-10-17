import { HttpStatus } from '@nestjs/common';

import { BaseException } from '~common/exceptions/base.exception';

export class UnauthorizedException extends BaseException {
  constructor(message: string, code: string, status = HttpStatus.UNAUTHORIZED) {
    super(message, { httpStatus: status, code });
  }
}
