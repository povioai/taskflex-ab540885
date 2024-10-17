import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { appConstants } from '~modules/app/app.constants';
import { GetAuthenticatedUser } from '~modules/auth/decorators/get-authenticated-user.decorator';
import { AuthenticationGuard } from '~modules/auth/guards/authentication.guard';
import { IAuthenticatedUser } from '~modules/auth/interfaces/authenticated-user.interface';

import { PushNotificationTokenDto } from './dtos/push-notification-token.dto';
import { PushNotificationTokenPostDto } from './dtos/push-notification-token.post.dto';
import { PushNotificationTokenService } from './push-notification-token.service';

@ApiTags('Push Notification Token')
@Controller('push-notification-token')
@ApiExcludeController()
export class PushNotificationTokenController {
  constructor(private readonly pushNotificationTokenService: PushNotificationTokenService) {}

  @Post('/')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Create Push Notification Token' })
  @ApiOkResponse({ type: PushNotificationTokenDto })
  async create(
    @GetAuthenticatedUser() user: IAuthenticatedUser,
    @Body() body: PushNotificationTokenPostDto,
  ): Promise<PushNotificationTokenDto> {
    const pushNotificationToken = await this.pushNotificationTokenService.create({
      token: body.token,
      userId: user.id,
    });

    return PushNotificationTokenDto.create(pushNotificationToken);
  }
}
