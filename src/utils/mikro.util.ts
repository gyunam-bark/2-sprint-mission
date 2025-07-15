import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config';
import { SqlEntityManager } from '@mikro-orm/postgresql';

let orm: MikroORM;

export const initializeOrm = async (): Promise<MikroORM> => {
  if (!orm) {
    orm = await MikroORM.init(config);
  }
  return orm;
};

export const getEm = async (): Promise<SqlEntityManager> => {
  const orm = await initializeOrm();
  return orm.em.fork() as SqlEntityManager;
};

export const clearTable = async (): Promise<void> => {
  return await orm.getSchemaGenerator().clearDatabase();
};

export const closeOrm = async (): Promise<void> => {
  return await orm.close();
};
