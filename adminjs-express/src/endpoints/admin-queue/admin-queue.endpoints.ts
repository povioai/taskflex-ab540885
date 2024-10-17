import { AxiosInstance } from 'axios';

import { IPaginatedListQueryOptions } from '../interfaces/options.interfaces.js';
import { IPaginatedListResponseOptions } from '../interfaces/records.interface.js';
import { AdminQueueStatsDto } from './dtos/admin-queue-stats.dto.js';
import { AdminQueueDto } from './dtos/admin-queue.dto.js';

type GetCountByState = {
  accessToken: string;
  state: string;
  queue: string;
};

type GetQueuesStats = {
  accessToken: string;
  queues: string[];
};
export class AdminQueueEndpoints {
  private WHITELISTED_OUTPUT_FIELDS = ['output.code', 'output.name', 'output.stack', 'output.message', 'output.status'];

  constructor(axios: AxiosInstance, route: string) {
    this.axios = axios;
    this.route = route;
  }

  axios: AxiosInstance;
  route: string;

  async getQueuesStats({ accessToken, queues }: GetQueuesStats): Promise<AdminQueueStatsDto> {
    const result = {
      created: 0,
      retry: 0,
      active: 0,
      completed: 0,
      failed: 0,
    };

    for (const queue of queues) {
      result.created += await this.getCountByState({ accessToken, state: 'created', queue });
      result.retry += await this.getCountByState({ accessToken, state: 'retry', queue });
      result.active += await this.getCountByState({ accessToken, state: 'active', queue });
      result.completed += await this.getCountByState({ accessToken, state: 'completed', queue });
      result.failed +=
        (await this.getCountByState({ accessToken, state: 'failed', queue })) +
        (await this.getCountByState({ accessToken, state: 'cancelled', queue })) +
        (await this.getCountByState({ accessToken, state: 'expired', queue }));
    }

    return result;
  }

  async removeQueueItem(accessToken: string, queueId: string): Promise<void> {
    await this.axios.post(
      `${this.route}/job/records/${queueId}/delete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  async listAdminQueues(
    accessToken: string,
    query: IPaginatedListQueryOptions & { states?: string[]; queues: string[] },
  ): Promise<IPaginatedListResponseOptions<AdminQueueDto>> {
    const allItems: AdminQueueDto[] = [];
    const allMetas: any[] = [];
    for (const queue of query.queues) {
      for (let i = 0; i < (query?.states?.length || 0); i++) {
        const state = query?.states![i];
        const queryParams = [`page=${query?.page ?? 1}`, `perPage=${query?.limit ?? 10}`, `filters.name=${queue}`];
        queryParams.push(`filters.state=${state}`);

        let queryStr = queryParams.join('&');
        queryStr = queryStr ? `?${queryStr}` : '';

        const response = await this.axios.get(`${this.route}/job/actions/list${queryStr}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const { meta, records } = response.data;
        const items: AdminQueueDto[] = records.map((r: any) => r.params);

        items.forEach((item: AdminQueueDto) => {
          const itemDataFields = Object.entries(item).filter(([key]) => key.startsWith('data.'));
          item.data = itemDataFields.map(([key, value]) => ({ field: key.replace('data.', ''), value }));

          const outputFields = Object.entries(item).filter(([key]) => this.WHITELISTED_OUTPUT_FIELDS.includes(key));
          item.output = outputFields.map(([key, value]) => ({ field: key.replace('output.', ''), value }));
        });

        allItems.push(...items);
        allMetas.push(meta);
      }
    }

    return {
      records: allItems,
      meta: {
        direction: 'asc',
        page: 1,
        perPage: 100,
        sortBy: 'createdon',
        total: +allMetas.reduce((acc, m) => acc + m.total, 0),
      },
    };
  }

  private async getCountByState({ accessToken, state, queue }: GetCountByState): Promise<number> {
    const response = await this.axios.get(
      `${this.route}/job/actions/list?page=1&perPage=1&filters.state=${state}&filters.name=${queue}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return +response.data.meta.total;
  }
}
