import { NotImplementedException } from '@nestjs/common';

import { IOrderItem } from '~common/interfaces/order.item.interface';

export type IPaginationOrderByPrisma = Record<string, 'asc' | 'desc'>;

/**
 * Generate Prisma pagination order
 * - todo, multiple order by is not supported/consistent
 */
export function generatePaginationOrderByPrisma(listOrder?: IOrderItem[]): IPaginationOrderByPrisma[] | undefined {
  return listOrder?.map((order) => {
    const ordering: 'asc' | 'desc' = order.direction.toLowerCase() as 'asc' | 'desc';
    if (!['asc', 'desc'].includes(ordering)) {
      throw new NotImplementedException(`Unknown ordering direction '${order.direction}'.`);
    }
    return { [order.propertyName]: ordering };
  });
}
