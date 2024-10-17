export class AdminQueueDto {
  readonly id!: string;
  readonly name!: string;
  readonly state!: string;
  readonly on_complete!: boolean;
  readonly priority!: number;
  readonly retrybackoff!: boolean;
  readonly retrycount!: number;
  readonly retrydelay!: number;
  readonly retrylimit!: number;
  readonly singletonkey!: string;
  readonly singletonon!: string;
  readonly startafter!: string;
  readonly startedon!: string;
  readonly completedon!: string;
  readonly createdon!: string;
  readonly keepuntil!: string;
  readonly expirein!: { minutes: number };

  data?: { field: string; value: any }[];
  output?: { field: string; value: any }[];
}
