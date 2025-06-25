import { toMB } from '../util/to-util.js';

export const getHealthCheck = () => {
  const status = 'OK';
  const uptime = process.uptime();
  const timestamp = new Date();
  const memoryUsage = process.memoryUsage();

  const memory = {
    rss: toMB(memoryUsage.rss),
    heapTotal: toMB(memoryUsage.heapTotal),
    heapUsed: toMB(memoryUsage.heapUsed),
  };

  const data = {
    status,
    uptime,
    timestamp,
    memory,
  };

  return data;
};
