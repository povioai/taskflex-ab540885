import type { ValidationError } from 'class-validator';

/**
 * Wrapper for class-validator non-standard ValidationError array
 */
export class ValidationErrors extends Error {
  public readonly target: object | undefined;
  constructor(public readonly errors: ValidationError[]) {
    const target = errors?.[0]?.target;
    super(
      `Validation failed for ${target ? target.constructor.name : 'unknown'} on ${errors.map((e) => e.property).join(', ')}`,
      { cause: errors },
    );
    this.target = target;
  }
}
