import { MediaUse } from './enums/media.use.enum';
import { IMediaConstraints } from './interfaces/media.constraints.interface';

export const mediaUseConstraints: {
  [key in MediaUse]: IMediaConstraints;
} = {
  DOCUMENT: { maxContentLength: 100 * 1024 * 1024, allowedMimeTypes: ['*/*'] }, // 100 MB
};
