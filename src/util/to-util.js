import { COMMON_SORT, PRISMA_OPTION } from '../constant/constant.js';

export const toMB = (bytes = 0) => (bytes / 1024 / 1024).toFixed(2) + 'MB';

export const toOrderBy = (sort) => {
  const orderBy = sort === COMMON_SORT.LATEST ? PRISMA_OPTION.ORDER_BY_DESCEND : PRISMA_OPTION.ORDER_BY_ASCEND;
  return sort
    ? {
        createdAt: orderBy,
      }
    : {};
};
