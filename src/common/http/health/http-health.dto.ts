import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

export class HttpHealthDto {
  @Expose()
  @IsString()
  @IsOptional()
  readonly uptime?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly stage?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly version?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly release?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly buildTime?: string;

  static create(data: IHttpHealthDto): HttpHealthDto {
    return plainToValidatedInstance(HttpHealthDto, data);
  }
}

export interface IHttpHealthDto extends HttpHealthDto {}
