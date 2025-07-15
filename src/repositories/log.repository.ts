import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { LogEntity } from '../entities/log.entity';
import { getEm } from '../utils/mikro.util';
import { LogParams } from '../types/log.type';

export const createLogEntity = async (log: LogEntity): Promise<LogEntity> => {
  const em = await getEm();

  await em.persistAndFlush(log);

  return log;
};

export const getLogEntityList = async (
  where: FilterQuery<LogEntity>,
  options: FindOptions<LogEntity>
): Promise<[LogEntity[], number]> => {
  const em = await getEm();

  return await em.findAndCount(LogEntity, where, options);
};

export const getLogEntity = async (where: FilterQuery<LogEntity>): Promise<LogEntity> => {
  const em = await getEm();

  return await em.findOneOrFail(LogEntity, where);
};

export const deleteProductEntity = async <T>(params: LogParams) => {
  const em = await getEm();

  await em.nativeDelete(LogEntity, params);
};
