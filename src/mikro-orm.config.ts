import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Options } from '@mikro-orm/core';
import ENV from './utils/env.util';

const config: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  clientUrl: ENV.DATABASE_URL,
  entities: ['dist/entities/*.entity.js'],
  entitiesTs: ['src/entities/*.entity.ts'],
  migrations: {
    path: './src/migrations',
    emit: 'ts',
  },
  discovery: { warnWhenNoEntities: false },
};

export default config;
