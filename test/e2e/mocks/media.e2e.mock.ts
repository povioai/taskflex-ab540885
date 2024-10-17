import { createMock } from '@golevelup/ts-jest';
import { INestApplication } from '@nestjs/common';

import { MediaUploadProviderS3PutService } from '~vendors/media-upload-provider-s3-put/media-upload-provider-s3-put.service';

import { ITestNestSetupProviderOverride } from '../../interfaces/nest-setup.test.provider-override.interface';
import { mediaPresignedUrlPutStub } from '../../stubs/media-upload-provider-s3-put.stub';

export const e2eMockMedia: ITestNestSetupProviderOverride[] = [
  {
    typeOrToken: MediaUploadProviderS3PutService,
    value: createMock<MediaUploadProviderS3PutService>({
      generatePresignedUrlData: jest.fn().mockReturnValue(mediaPresignedUrlPutStub),
    }),
  },
];

export function e2eMockMediaClear(app: INestApplication): void {
  const mediaUploadProviderS3PutService = app.get(MediaUploadProviderS3PutService);
  jest.spyOn(mediaUploadProviderS3PutService, 'generatePresignedUrlData').mockClear();
}
