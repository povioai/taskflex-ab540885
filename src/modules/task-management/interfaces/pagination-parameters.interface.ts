export interface IPaginationParameters {
   page: number;
   pageSize: number;
   sortBy?: string;
   sortOrder?: 'asc' | 'desc';
}