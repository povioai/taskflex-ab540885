import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

import { TransformInputToArray } from '~vendors/class-validator';

import { appConstants } from '~modules/app/app.constants';

export class UserFilter {
  @Expose()
  @ApiPropertyOptional({ description: 'Ids', example: [] })
  @TransformInputToArray()
  @IsArray()
  @IsUUID(appConstants.uuid.version, { each: true })
  @IsOptional()
  readonly ids?: string[];

  @Expose()
  @ApiPropertyOptional({ description: 'Search', example: '' })
  @IsString()
  @IsOptional()
  readonly search?: string;
}
