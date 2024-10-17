import { HttpStatus } from '@nestjs/common';

import { BaseException } from '~common/exceptions/base.exception';

export class NotImplementedException extends BaseException {
  constructor(message: string, code: string, status = HttpStatus.NOT_IMPLEMENTED) {
    super(message, { httpStatus: status, code });
  }
}
