/* eslint no-console: 0 */

import { blue, green, red } from 'chalk';
import { DateTime } from 'luxon';

import type { IHttpResponseLog } from '~common/http/interfaces/http-log.interface';
import type { ILog } from '~common/logging';

export function loggerConsoleFormatter(_log: ILog) {
  switch (_log.type) {
    case 'http': {
      const log = _log as IHttpResponseLog;
      let level: string = log.level ?? 'unknown';
      switch (level) {
        case 'verbose':
        case 'debug':
        case 'log':
          if (log.data.responseCode! < 300) {
            level = green(log.data.responseCode!);
          } else {
            level = blue(log.data.responseCode ?? 'unknown');
          }
          break;
        default:
          level = red(log.data.responseCode ?? 'unknown');
          break;
      }
      console.log(
        `[${log.timestamp ? DateTime.fromMillis(log.timestamp) : '-'}] ${log.traceId ? `${log.traceId} ` : ''}${log.spanId ? `${log.spanId} ` : ''}${log.data.remoteIp ?? '-'} ${log.data.userId ?? '-'} "${blue(log.data.requestUrl || '')}" ${level} ${log.data.responseTime}ms`,
      );
      break;
    }
    default: {
      const log = _log as ILog;
      let level: string = log.level ?? 'unknown';
      switch (level) {
        case 'verbose':
        case 'debug':
        case 'log':
          level = blue(level);
          break;
        default:
          level = red(level);
          break;
      }
      console.log(
        `[${log.timestamp ? DateTime.fromMillis(log.timestamp) : '-'}] ${log.traceId ? `${log.traceId} ` : ''}${log.spanId ? `${log.spanId} ` : ''} ${log.context} ${level} ${log.code ? green(log.code) + ' ' : ''}${log.message ?? ''}`,
      );
      if (log.data) {
        console.log(log.data);
      }
      if (log.error) console.log(log.error);
      else if (log.stack) console.log(log.stack);
    }
  }
}
