import { Injectable } from '@nestjs/common';

import { MediaUploadProviderS3PutService } from '~vendors/media-upload-provider-s3-put/media-upload-provider-s3-put.service';
import { makeUUID } from '~vendors/short-uuid';

import { InternalServerErrorException } from '~common/exceptions';
import { LoggerService } from '~common/logging';

import { MediaStatus } from '~modules/media/enums/media.status.enum';
import { MediaUse } from '~modules/media/enums/media.use.enum';
import { IMedia } from '~modules/media/interfaces/media.interface';
import { mediaUseConstraints } from '~modules/media/media.constants';
import { MediaService } from '~modules/media/media.service';

import { MediaPresignedUrlConfig } from './media-presigned-url.config';

@Injectable()
export class MediaPresignedUrlService {
  constructor(
    private readonly mediaPresignedUrlConfig: MediaPresignedUrlConfig,
    private readonly logger: LoggerService,
    private readonly mediaService: MediaService,
    private readonly mediaUploadProviderS3PutService: MediaUploadProviderS3PutService,
  ) {}

  async createPresignedUrl(userId: string, use: MediaUse): Promise<IMedia> {
    const mediaConstraints = mediaUseConstraints[use];

    const id = makeUUID();
    const key = `${this.mediaPresignedUrlConfig.uploadFolder}/${use}/${id}`;

    try {
      const response = await this.mediaUploadProviderS3PutService.generatePresignedUrlData(key, {
        minContentLength: mediaConstraints.minContentLength,
        maxContentLength: mediaConstraints.maxContentLength,
      });

      const media = await this.mediaService.create({
        objectKey: key,
        url: response.mediaUrl,
        status: MediaStatus.CREATED,
        use,
        userId,
      });

      return media;
    } catch (err) {
      this.logger.error(`Error occurred generating pre-signed url for user ${userId} for use ${use}. Error: `, err);
      throw new InternalServerErrorException(
        'Error generating media pre-signed url.',
        'MEDIA_PRESIGNED_URL_ERROR_GENERATING',
      );
    }
  }

  async getMediaMimeType(objectKey: string): Promise<string | undefined> {
    const result = await this.mediaUploadProviderS3PutService.getObjectMimeType(objectKey);
    return result;
  }
}
