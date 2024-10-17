import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, IsUrl, IsUUID } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { IMedia } from '~modules/media/interfaces/media.interface';

import { MediaPresignedUrlUploadMethod } from '../enums/media-presigned-url.upload-method.enum';

export class MediaPresignedUrlDto {
  @Expose()
  @ApiProperty({ description: 'Media Id' })
  @IsUUID()
  readonly id!: string;

  @Expose()
  @ApiProperty({ description: 'Media Url' })
  @IsUrl()
  readonly mediaUrl!: string;

  @Expose()
  @ApiProperty({ description: 'Upload Method', enum: MediaPresignedUrlUploadMethod })
  @IsEnum(MediaPresignedUrlUploadMethod)
  readonly uploadMethod!: MediaPresignedUrlUploadMethod;

  @Expose()
  @ApiProperty({ description: 'Upload Url' })
  @IsUrl()
  readonly uploadUrl!: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Fields', type: Object })
  @IsObject()
  @IsOptional()
  readonly fields?: Record<string, string>;

  static create(media: IMedia): MediaPresignedUrlDto {
    return plainToValidatedInstance(MediaPresignedUrlDto, {
      id: media.id,
      mediaUrl: media.url,
      uploadMethod: MediaPresignedUrlUploadMethod.PUT,
      uploadUrl: media.url,
    });
  }
}
