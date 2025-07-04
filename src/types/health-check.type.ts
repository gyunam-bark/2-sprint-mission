export type MemoryUsage = {
  rss: string;
  heapTotal: string;
  heapUsed: string;
};

export type HealthCheck = {
  status: 'OK';
  uptime: number;
  timestamp: Date;
  memory: MemoryUsage;
};
