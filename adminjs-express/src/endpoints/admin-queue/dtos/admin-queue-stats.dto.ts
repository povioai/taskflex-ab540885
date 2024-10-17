export class AdminQueueStatsDto {
  readonly created!: number;
  readonly retry!: number;
  readonly active!: number;
  readonly completed!: number;
  readonly failed!: number;
}
