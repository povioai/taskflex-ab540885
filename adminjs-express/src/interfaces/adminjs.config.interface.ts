export interface IAdminJSConfig {
  enabled?: boolean;
  path?: string;
  email: string;
  password: string;
  devPort: number;
  pgBossQueues: string[];
}
