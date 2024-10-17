import { ListOrderType } from '../interfaces/options.interfaces.js';

export class GenericListDto<DtoType> {
  readonly items!: DtoType[];
  readonly order?: ListOrderType;
  readonly total?: number;
}

export class PaginationDto<DtoType> extends GenericListDto<DtoType> {
  readonly page!: number;
  readonly limit?: number;
}
