import { Box, Button, Icon, Table, TableBody, TableCell, TableHead, TableRow, Text } from '@adminjs/design-system';
import { styled } from '@adminjs/design-system/styled-components';
import { ApiClient, useCurrentAdmin } from 'adminjs';
import React, { useEffect, useState } from 'react';

import { AdminQueueStatsDto } from '../../endpoints/admin-queue/dtos/admin-queue-stats.dto.js';
import { AdminQueueDto } from '../../endpoints/admin-queue/dtos/admin-queue.dto.js';
import { endpoints } from '../../endpoints/endpoints.js';

export const QUEUE_PAGE_NAME = 'queuePage';
const api = new ApiClient();
const perPage = 10;

// As per AdminJS docs, Dashboard and Pages don't have any controlling component, so they don't receive any props.
// https://adminjs-docs.web.app/tutorial-writing-react-components.html
const QueuePage = () => {
  const [queueStats, setQueueStats] = useState<AdminQueueStatsDto | null>(null);
  const [queues, setQueues] = useState<AdminQueueDto[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterState, setFilterState] = useState<string[] | undefined>(['completed']);
  const [liveRefresh, setLiveRefresh] = useState<boolean>(false);
  const [pgbossQueues, setPgbossQueues] = useState<string[]>([]);

  useEffect(() => {
    (function fetchPageProps() {
      // This is probably AdminJS idiomatic way to pass initial props (hydrate) a component considered as "AdminJsPage"
      api.getPage<string[]>({ pageName: QUEUE_PAGE_NAME }).then(({ data }) => {
        setPgbossQueues(data);
        setLiveRefresh(true);
      });
    })();
  }, []);
  const [currentAdmin, setCurrentAdmin] = useCurrentAdmin();
  const accessToken = currentAdmin?.accessToken as string;

  const fetchQueueStats = async () => {
    const newQueueStats = await endpoints.adminQueue.getQueuesStats({ accessToken, queues: pgbossQueues });
    setQueueStats(newQueueStats);
  };

  const fetchListQueues = async () => {
    const queuesPage = await endpoints.adminQueue.listAdminQueues(accessToken, {
      page: currentPage,
      limit: perPage,
      states: filterState,
      queues: pgbossQueues,
    });
    setQueues(queuesPage.records);
    setTotal(queuesPage.meta.total);
  };

  const removeQueueItem = async (queueId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this queue item?');
    if (!confirmDelete) {
      return;
    }
    await endpoints.adminQueue.removeQueueItem(accessToken, queueId);
    fetchQueueStats();
    fetchListQueues();
  };

  useEffect(() => {
    fetchListQueues();
  }, [currentPage, filterState]);

  useEffect(() => {
    if (liveRefresh) {
      const interval = setInterval(() => {
        fetchQueueStats();
        fetchListQueues();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [liveRefresh, currentPage, filterState]);

  const goToNextPage = () => setCurrentPage((page) => page + 1);
  const goToPreviousPage = () => setCurrentPage((page) => page - 1);

  return (
    <>
      <HeaderBox display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="h1">Queue Statistics</Text>
        {!liveRefresh && (
          <Button onClick={() => setLiveRefresh(true)} variant="primary" mr="5px">
            Live Refresh is OFF
          </Button>
        )}
        {liveRefresh && (
          <Button onClick={() => setLiveRefresh(false)} variant="danger">
            Live Refresh is ON
          </Button>
        )}
      </HeaderBox>
      <StatsBox display="flex" justifyContent="space-between">
        <StatsItem>
          <StatsLink onClick={() => setFilterState(['completed'])}>
            <StatsValue>{queueStats?.completed ?? '-'}</StatsValue>
            <Text>Processed</Text>
          </StatsLink>
        </StatsItem>
        <StatsItem>
          <StatsLink onClick={() => setFilterState(['active'])}>
            <StatsValue>{queueStats?.active ?? '-'}</StatsValue>
            <Text>Busy</Text>
          </StatsLink>
        </StatsItem>
        <StatsItem>
          <StatsLink onClick={() => setFilterState(['retry'])}>
            <StatsValue>{queueStats?.retry ?? '-'}</StatsValue>
            <Text>Retries</Text>
          </StatsLink>
        </StatsItem>
        <StatsItem>
          <StatsLink onClick={() => setFilterState(['created'])}>
            <StatsValue>{queueStats?.created ?? '-'}</StatsValue>
            <Text>Scheduled</Text>
          </StatsLink>
        </StatsItem>
        <StatsItem>
          <StatsLink onClick={() => setFilterState(['failed', 'cancelled', 'expired'])}>
            <StatsValue>{queueStats?.failed ?? '-'}</StatsValue>
            <Text>Dead</Text>
          </StatsLink>
        </StatsItem>
      </StatsBox>

      <QueuesBox marginTop={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Scheduled</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queues.map((queue) => (
              <TableRow key={queue.id}>
                <TableCell>
                  <a href={`/admin/resources/job/records/${queue.id}/show`} target="_blank">{`${queue.name}`}</a>
                </TableCell>
                <TableCell>
                  {queue.data?.map((item, index) => (
                    <Text key={index}>
                      <b>{item.field}</b>: {item.value}
                    </Text>
                  ))}

                  {queue.output?.length ? (
                    <Button
                      onClick={() => alert(queue.output?.map((item) => `${item.field}: ${item.value}`).join('\n'))}
                    >
                      Show output
                    </Button>
                  ) : null}
                </TableCell>

                <TableCell>
                  <Text>{queue.createdon ? new Date(queue.createdon).toLocaleString() : '-'}</Text>
                </TableCell>
                <TableCell>
                  <Text>
                    {queue.completedon ? '-' : queue.startafter ? new Date(queue.startafter).toLocaleString() : '-'}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text>{queue.completedon ? new Date(queue.completedon).toLocaleString() : '-'}</Text>
                </TableCell>
                <TableCell>
                  <a href="#" onClick={() => removeQueueItem(queue.id)} style={{ color: 'red' }}>
                    X
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="space-between" mt="xl">
          <Button onClick={goToPreviousPage} disabled={currentPage === 1} variant="primary" marginLeft="24px">
            <Icon icon="ChevronLeft" />
            Previous
          </Button>

          <Button
            onClick={goToNextPage}
            disabled={!total || currentPage * perPage >= total}
            variant="primary"
            marginRight="24px"
          >
            Next
            <Icon icon="ChevronRight" />
          </Button>
        </Box>
      </QueuesBox>
    </>
  );
};

const HeaderBox = styled(Box)`
  margin: 20px;
`;

const StatsBox = styled(Box)`
  margin: 0 20px 20px 20px;
  padding: 20px;
  background: #fff;
  border: 1px solid rgb(238, 238, 239);
  border-radius: 10px;
`;

const StatsItem = styled(Box)`
  flex: 1;
  text-align: center;
`;

const StatsLink = styled(Box)`
  display: inline-block;
  cursor: pointer;
`;

const StatsValue = styled(Text)`
  font-weight: 700;
`;

const QueuesBox = styled(Box)`
  margin: 0 20px 20px 20px;
  padding: 20px;
  background: #fff;
  border: 1px solid rgb(238, 238, 239);
  border-radius: 10px;
`;

export default QueuePage;
