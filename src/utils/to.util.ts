import { UserEntity } from '../entities/user.entity';
import { COMMON_SORT } from '../enums/common.enum';
import { MIKRO_ORDER_BY } from '../enums/mikro.enum';
import { Payload } from '../types/payload.type';

export const bytesToMB = (bytes: number): string => (bytes / 1024 / 1024).toFixed(2) + 'MB';

export const userToPayload = (user: UserEntity): Payload => ({ id: user.id, role: user.role });

export const sortToOrderBy = (sort: COMMON_SORT | undefined) => {
  const orderByOption = sort === COMMON_SORT.OLDEST ? MIKRO_ORDER_BY.OLDEST : MIKRO_ORDER_BY.LASTEST;

  return {
    createdAt: orderByOption,
  };
};
