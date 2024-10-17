import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedListResponse } from '~common/decorators/api-paginated-list-response.decorator';
import { PaginatedQuery } from '~common/decorators/paginated-query.decorator';
import { PaginatedListDto } from '~common/dtos/paginated-list.dto';
import { PaginatedListQueryDto } from '~common/dtos/paginated-list.query.dto';
import { UuidValidator } from '~common/validators/uuid.validator';

import { appConstants } from '~modules/app/app.constants';
import { GetAuthenticatedUser } from '~modules/auth/decorators/get-authenticated-user.decorator';
import { AuthenticationGuard } from '~modules/auth/guards/authentication.guard';
import { IAuthenticatedUser } from '~modules/auth/interfaces/authenticated-user.interface';

import { UserSessionDto } from './dtos/user-session.dto';
import { UserSessionFilter } from './filters/user-session.filter';
import { IUserSessionFilter } from './interfaces/user-session.filter.interface';
import { UserSessionService } from './user-session.service';

@ApiTags('User Session')
@Controller('user-session')
@ApiExcludeController()
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(AuthenticationGuard)
  @Get('/')
  @ApiOperation({ summary: 'List User Sessions' })
  @ApiPaginatedListResponse(ApiOkResponse, UserSessionDto, [], UserSessionFilter)
  async list(
    @GetAuthenticatedUser() user: IAuthenticatedUser,
    @PaginatedQuery([], UserSessionFilter) query: PaginatedListQueryDto<UserSessionFilter>,
  ): Promise<PaginatedListDto<UserSessionDto, UserSessionFilter>> {
    const { id: userId } = user;
    const userSessions = await this.userSessionService.listForUser(userId, query);

    return PaginatedListDto.create<UserSessionDto, IUserSessionFilter>(userSessions, UserSessionDto.create);
  }

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(AuthenticationGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get User Session By Id' })
  @ApiOkResponse({ type: UserSessionDto })
  async getById(
    @GetAuthenticatedUser() user: IAuthenticatedUser,
    @Param('id', UuidValidator) sessionId: string,
  ): Promise<UserSessionDto> {
    const { id: userId } = user;
    const userSession = await this.userSessionService.findForUserByIdOrThrow(userId, sessionId);

    return UserSessionDto.create(userSession);
  }

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(AuthenticationGuard)
  @Delete('/')
  @ApiOperation({ summary: 'Delete All User Sessions' })
  async deleteAllUserSession(@GetAuthenticatedUser() user: IAuthenticatedUser): Promise<void> {
    const { id: userId } = user;
    await this.userSessionService.deleteAllForUser(userId);
  }

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete User Session By Id' })
  async deleteUserSessionById(
    @GetAuthenticatedUser() authenticationuser: IAuthenticatedUser,
    @Param('id', UuidValidator) sessionId: string,
  ): Promise<void> {
    const { id: userId } = authenticationuser;
    await this.userSessionService.deleteForUserById(userId, sessionId);
  }
}
