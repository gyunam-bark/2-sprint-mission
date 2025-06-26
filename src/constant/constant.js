export const NODE_ENV_OPTION = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

export const PRISMA_OPTION = {
  ORDER_BY_ASCEND: 'asc',
  ORDER_BY_DESCEND: 'desc',
  INSENSITIVE: 'insensitive',
};

export const COMMON_SORT = {
  LATEST: 'latest',
  OLDEST: 'oldest',
};

export const COMMON_STATUS = {
  ACTIVE: 'active', // 활성화
  INACTIVE: 'inactive', // 비활성화
};

export const USER_ROLE = {
  PUBLIC: 'public', // 비로그인 가능
  USER: 'user', // 로그인만 필요
  MASTER: 'master', // 오직 MASTER
};

export const USER_STATUS = {
  ACTIVE: 'active', // 활성화
  INACTIVE: 'inactive', // 비활성화
  LOCK: 'lock', // 잠김
};
