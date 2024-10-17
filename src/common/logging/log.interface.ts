import { IBaseLog } from '~vendors/logger';

/**
 * Data needed in a log message
 *  - each request will start with a full dump of a user's request
 *     so there is no need to log everything each time
 */
export interface ILog extends IBaseLog {
  spanId?: string;
  traceId?: string;
  timestamp?: number;
}
