import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { PaginatedListDto } from '~common/dtos/paginated-list.dto';

import { UserDto } from '~modules/user/dtos/user.dto';
import { UserFilter } from '~modules/user/filters/user.filter';

import { UserFixture } from '../../../../fixtures/user.fixture';
import { IBasePaginationQueryTest } from '../../../../interfaces/base-pagination.query.test.interface';

export async function __e2eShouldSuccessfullyListUsersOrderedByCreatedAtDescending(
  app: INestApplication,
): Promise<void> {
  const email1 = 'user.list.success.ordered.createdAt.descending+user1@example.com';
  const email2 = 'user.list.success.ordered.createdAt.descending+user2@example.com';
  const email3 = 'user.list.success.ordered.createdAt.descending+user3@example.com';
  const emailMe = 'user.list.success.ordered.createdAt.descending+me@example.com';
  const password = '.Password1';

  const user1 = await UserFixture.createUser(app, email1, password);
  const user2 = await UserFixture.createUser(app, email2, password);
  const user3 = await UserFixture.createUser(app, email3, password);

  const query: IBasePaginationQueryTest & UserFilter = {
    ids: [user1.id, user2.id, user3.id],
    order: '-createdAt',
    limit: 10,
    page: 1,
  };

  const userMe = await UserFixture.createUser(app, emailMe, password);
  const accessToken = await UserFixture.createUserAccessToken(app, userMe.id);

  const response = await request(app.getHttpServer()).get('/users').auth(accessToken, { type: 'bearer' }).query(query);

  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.body as PaginatedListDto<UserDto, UserFilter>;

  expect(responseBody.page).toStrictEqual(1);
  expect(responseBody.totalItems).toStrictEqual(3);
  expect(responseBody.items[0].id).toStrictEqual(user3.id);
  expect(responseBody.items[1].id).toStrictEqual(user2.id);
  expect(responseBody.items[2].id).toStrictEqual(user1.id);
}
