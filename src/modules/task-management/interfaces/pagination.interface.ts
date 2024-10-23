export interface PaginationParameters {
  offset: number;
  limit: number;
}

export function getPaginationParameters(page: number, tasksPerPage: number): PaginationParameters {
  const offset = (page - 1) * tasksPerPage;
  const limit = tasksPerPage;
  return { offset, limit };
}