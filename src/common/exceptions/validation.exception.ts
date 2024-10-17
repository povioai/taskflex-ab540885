import { HttpStatus } from '@nestjs/common';
import { type ValidationError } from 'class-validator';

import { ValidationErrors } from '~vendors/class-validator';

import { BaseException, IBaseException } from '~common/exceptions/base.exception';

import { type IErrorResponse } from './interfaces/error-response.interface';

export class ValidationException extends BaseException {
  code = 'validation';
  httpStatus = HttpStatus.BAD_REQUEST;
  errors: ValidationError[];
  target: object | undefined;

  constructor(message: string | undefined, options: IBaseException & { target?: object; errors: ValidationError[] }) {
    const errors = options.errors;
    if (!options.errors || options.errors.length === 0) {
      // programmatic error
      throw new Error('ValidationException requires at least one ValidationError');
    }
    const target = options?.target || options.errors[0].target;
    super(
      message ??
        `Validation failed for ${target ? target.constructor.name : 'unknown'} on ${errors.map((e) => e.property).join(', ')}`,
      { cause: options?.cause },
    );
    this.errors = options.errors;
    this.target = target;
  }

  static fromValidationErrorArray(errors: ValidationError[]) {
    return new ValidationException(undefined, { errors });
  }

  static fromValidationErrors(validationErrors: ValidationErrors) {
    return new ValidationException(validationErrors.message, {
      errors: validationErrors.errors,
      cause: validationErrors,
    });
  }

  toJSON(): IErrorResponse {
    return {
      status: 'error',
      code: this.code,
      message: this.message,
      errors: this.errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      })),
    };
  }
}
