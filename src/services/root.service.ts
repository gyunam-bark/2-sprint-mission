import { bytesToMB } from '../utils/to.util';
import { HealthCheck, MemoryUsage } from '../types/health-check.type';

export const getHealthCheck = (): HealthCheck => {
  const status = 'OK';
  const uptime = process.uptime();
  const timestamp = new Date();
  const memoryUsage = process.memoryUsage();

  const memory: MemoryUsage = {
    rss: bytesToMB(memoryUsage.rss),
    heapTotal: bytesToMB(memoryUsage.heapTotal),
    heapUsed: bytesToMB(memoryUsage.heapUsed),
  };

  return {
    status,
    uptime,
    timestamp,
    memory,
  };
};
