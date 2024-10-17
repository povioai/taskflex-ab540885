export type ListOrderType = [name: string, direction: 'ASC' | 'DESC'][];

export interface IGenericListQueryOptions {
  readonly order?: ListOrderType;
}

export interface IPaginatedListQueryOptions extends IGenericListQueryOptions {
  readonly page: number;
  readonly limit?: number;
}
