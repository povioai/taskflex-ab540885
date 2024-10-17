import { HttpStatus } from '@nestjs/common';

import { BaseException } from '~common/exceptions/base.exception';

export class InternalServerErrorException extends BaseException {
  constructor(message: string, code: string, status = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message, { httpStatus: status, code });
  }
}
