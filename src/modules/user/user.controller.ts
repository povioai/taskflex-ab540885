import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { appConstants } from '~modules/app/app.constants';
import { GetAuthenticatedUser } from '~modules/auth/decorators/get-authenticated-user.decorator';
import { AuthenticationWithApiKeyGuard } from '~modules/auth/guards/authentication-with-api-key.guard';
import { IAuthenticatedUser } from '~modules/auth/interfaces/authenticated-user.interface';

import { UserDto } from './dtos/user.dto';
import { UserUpdateDto } from './dtos/user.update.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @ApiSecurity(appConstants.swagger.apiKeyAuthName)
  @UseGuards(AuthenticationWithApiKeyGuard)
  @ApiOperation({ summary: 'Get Me' })
  @ApiOkResponse({ type: UserDto })
  async getMe(@GetAuthenticatedUser() user: IAuthenticatedUser): Promise<UserDto> {
    const userMe = await this.userService.findByIdOrThrow(user.id);

    return UserDto.create(userMe);
  }

  @Put('/me')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @ApiSecurity(appConstants.swagger.apiKeyAuthName)
  @UseGuards(AuthenticationWithApiKeyGuard)
  @ApiOperation({ summary: 'Update me' })
  @ApiOkResponse({ type: UserDto })
  async updateMe(@GetAuthenticatedUser() user: IAuthenticatedUser, @Body() body: UserUpdateDto): Promise<UserDto> {
    await this.userService.findByIdOrThrow(user.id);
    const updatedMe = await this.userService.update(user.id, body);
    return UserDto.create(updatedMe);
  }
}
