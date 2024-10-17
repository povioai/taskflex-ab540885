import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UtilityAuthSocialGoogleService } from './utility-auth-social-google.service';

@ApiTags('Auth')
@Controller('utility-auth-social-google')
@ApiExcludeController()
export class UtilityAuthSocialGoogleController {
  constructor(private readonly utilityAuthSocialGoogleService: UtilityAuthSocialGoogleService) {}

  @Get('/generate')
  @ApiOperation({
    summary: 'Google Generate Authentication Url. ❗ This endpoint is not meant to be used by frontend applications.',
  })
  @ApiOkResponse({ type: String })
  async generate(): Promise<string> {
    const url = await this.utilityAuthSocialGoogleService.generateAuthenticationUrl();
    return url;
  }
}
