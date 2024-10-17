export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      requestMetadata?: {
        spanId?: string;
        traceId?: string;
        requestStart?: bigint;
      };
    }
  }
}
