import { Global, Module } from '@nestjs/common';

import { MediaPresignedUrlModule } from '~modules/media-presigned-url/media-presigned-url.module';
import { MediaModule } from '~modules/media/media.module';

import { MediaValidationService } from './media-validation.service';

@Global()
@Module({
  imports: [MediaModule, MediaPresignedUrlModule],
  providers: [MediaValidationService],
  exports: [MediaValidationService],
})
export class MediaValidationModule {}
