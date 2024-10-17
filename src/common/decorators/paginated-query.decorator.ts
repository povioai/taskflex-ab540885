import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request } from 'express';

import { ValidationErrors } from '~vendors/class-validator';

import { PaginatedListQueryDto } from '~common/dtos/paginated-list.query.dto';
import { ValidationException } from '~common/exceptions';
import { IOrderItem } from '~common/interfaces/order.item.interface';
import { OrderDirection } from '~common/types/order.direction.type';

export const PaginatedQuery = <QueryOptionsFilter extends Record<string, any>>(
  allowedOrderProperties: string[] = [],
  filterType: { new (): QueryOptionsFilter } | undefined = undefined,
) => {
  // TODO: Check if this is in correct place (http - tied)
  return createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const query = request.query;

    const page = query[PaginatedListQueryDto.PAGE_KEY] as string | undefined;
    const limit = query[PaginatedListQueryDto.LIMIT_KEY] as string | undefined;

    const filter = createDeepCopy<Record<string, any>, Record<string, any>>(query);

    delete filter[PaginatedListQueryDto.PAGE_KEY];
    delete filter[PaginatedListQueryDto.LIMIT_KEY];
    delete filter[PaginatedListQueryDto.ORDER_KEY];

    let order: IOrderItem[] | undefined;
    const queryOrder = query[PaginatedListQueryDto.ORDER_KEY];
    if (queryOrder && typeof queryOrder === 'string') {
      let items = (queryOrder as string).split(',').map((item: string, itemIndex: number) => {
        if (item.length === 0) {
          throw new ValidationException(
            `Each value of query.${[PaginatedListQueryDto.ORDER_KEY]} must have at least 1 character.`,
            {
              errors: [
                {
                  property: `order.${itemIndex}`,
                },
              ],
            },
          );
        }

        let direction: OrderDirection;
        const sign = item[0];
        let propertyName = item;
        switch (sign) {
          case '+': {
            propertyName = item.substring(1);
            direction = 'ASC';
            break;
          }

          case '-': {
            propertyName = item.substring(1);
            direction = 'DESC';
            break;
          }

          default: {
            direction = 'ASC';
            break;

            // TODO: Get back to this, currently on default is ASC
            //  because adding '+' sign does not work with URL encoding, it's treated as space
            // throw new ValidationException(
            //   `Each value of query.${[PaginatedListQueryDto.ORDER_KEY]} must start with a + or -, which indicates direction (ASC, DESC).`,
            //   {
            //     errors: [
            //       {
            //         property: `order.${item}`,
            //       },
            //     ],
            //   },
            // );
          }
        }

        const orderItem: IOrderItem = {
          propertyName,
          direction: direction,
        };

        return orderItem;
      });
      items = items.filter((item) => allowedOrderProperties.includes(item.propertyName));
      order = items;
    }

    try {
      const inputObject = {
        page,
        limit,
        order,
        filter,
      };
      removeUndefined(inputObject);

      return PaginatedListQueryDto.create<QueryOptionsFilter>(inputObject as any, filterType);
    } catch (error) {
      const validationErrors: ValidationError[] = [];
      if (error instanceof Array) {
        error.forEach((err) => {
          if (err instanceof ValidationError) {
            validationErrors.push(err);
          }
        });
      } else if (error instanceof ValidationError) {
        validationErrors.push(error);
      } else if (error instanceof ValidationException) {
        throw error;
      }

      throw ValidationException.fromValidationErrors(new ValidationErrors(validationErrors));
    }
  })();
};

function createDeepCopy<InputType, OutputType>(input: InputType): OutputType {
  const result = JSON.parse(JSON.stringify(input)) as OutputType;
  return result;
}

function removeUndefined(obj: Record<string, any>): void {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
}
