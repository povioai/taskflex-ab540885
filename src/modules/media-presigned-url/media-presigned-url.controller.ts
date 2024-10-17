import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { appConstants } from '~modules/app/app.constants';
import { GetAuthenticatedUser } from '~modules/auth/decorators/get-authenticated-user.decorator';
import { AuthenticationWithApiKeyGuard } from '~modules/auth/guards/authentication-with-api-key.guard';
import { IAuthenticatedUser } from '~modules/auth/interfaces/authenticated-user.interface';

import { MediaPresignedUrlDto } from './dtos/media-presigned-url.dto';
import { MediaPresignedUrlPostDto } from './dtos/media-presigned-url.post.dto';
import { MediaPresignedUrlService } from './media-presigned-url.service';

@ApiTags('Media Presigned Url')
@Controller('media-presigned-url')
@ApiExcludeController()
export class MediaPresignedUrlController {
  constructor(private readonly mediaPresignedUrlService: MediaPresignedUrlService) {}

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @ApiSecurity(appConstants.swagger.apiKeyAuthName)
  @UseGuards(AuthenticationWithApiKeyGuard)
  @Post('/')
  @ApiOperation({ summary: 'Create Presigned Url' })
  @ApiOkResponse({ type: MediaPresignedUrlDto })
  async createPresignedUrl(
    @GetAuthenticatedUser() user: IAuthenticatedUser,
    @Body() body: MediaPresignedUrlPostDto,
  ): Promise<MediaPresignedUrlDto> {
    const media = await this.mediaPresignedUrlService.createPresignedUrl(user.id, body.use);

    return MediaPresignedUrlDto.create(media);
  }
}
