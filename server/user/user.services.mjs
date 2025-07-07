import bcrypt from 'bcrypt';
import database from '../database/prisma.client.mjs';
import * as PRISMA_CONSTANTS from '../database/prisma.constant.mjs';
import * as COMMON_DEFAULTS from '../common/common.default.mjs';
import COMMON_STATUSES from '../common/common.status.mjs';
import COMMON_SORTS from '../common/common.sort.mjs';
import HTTP_STATUSES from '../common/http.status.mjs';
import { errorWithStatus } from '../util/error.util.mjs';
import * as permission from '../util/permission.util.mjs';
import USER_ROLES from './user.role.mjs';

// SELECT
// MASTER 일 때는 모든 정보를 본다.
const SELECT_MASTER = {
  id: true,
  name: true,
  email: true,
  password: true,
  status: true,
  role: true,
  isAnonymous: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  lastLoginAt: true,
  lastLoginIp: true,
  products: true,
  articles: true,
  productComments: true,
  articleComments: true
};

const SELECT_DELETE = {
  id: true,
  name: true
};

const getSelect = (isMaster) => {
  return isMaster
    ? SELECT_MASTER
    : {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      products: true,
      articles: true
    };
};

// TRANSACTION
// DEACTIVATE/ACTIVATE/DELETE
const runUserTransaction = async (id, data = {}, done) => {
  return await database.$transaction([
    database.product.updateMany({
      where: { id: id },
      data: data
    }),
    database.article.updateMany({
      where: { id: id },
      data: data
    }),
    database.productComment.updateMany({
      where: { id: id },
      data: data
    }),
    database.articleComment.updateMany({
      where: { id: id },
      data: data
    }),
    done
  ]);
};

// 익명 사용자
const getAnonymous = async () => {
  return await database.user.findFirst({
    where: { isAnonymous: true }
  });
};

export const getUserList = async (queries = {}, user = {}) => {
  const {
    offset, limit, sort, query, showInactive
  } = queries;

  // 오래된 순 : 오름차순(ㅇㄹ 자음이 같음ㅋ)
  const orderBy = sort === COMMON_SORTS.OLDEST
    ? { createdAt: PRISMA_CONSTANTS.ORDER_BY_ASCEND }
    : { createdAt: PRISMA_CONSTANTS.ORDER_BY_DESCEND };

  // 해당 유저가 MASTER 인지 확인
  const isMaster = permission.isMaster(user);

  // MASTER 권한일 때만 비활성화 USER 를 볼 수 있다.
  const inactiveFilter = showInactive && isMaster
    ? {}
    : { status: COMMON_STATUSES.ACTIVE };

  // MASTER 가 아니면 MASTER 계정과 익명 계정을 볼 수 없다.
  const masterFilter = isMaster
    ? {}
    : {
      isAnonymous: COMMON_DEFAULTS.IS_ANONYMOUS_DEFAULT,
      role: { not: USER_ROLES.MASTER }
    };

  // query에 들어간 글자를 name 과 email 에서 검색한다.
  const searchFilter = query
    ? {
      OR: [
        { name: { contains: query, mode: PRISMA_CONSTANTS.CONTAINS_INSENSITIVE } },
        { email: { contains: query, mode: PRISMA_CONSTANTS.CONTAINS_INSENSITIVE } }
      ]
    }
    : {};

  const where = {
    ...inactiveFilter,
    ...masterFilter,
    ...searchFilter
  };

  const select = getSelect(isMaster);

  const userList = await database.user.findMany({
    skip: offset,
    take: limit,
    orderBy: orderBy,
    where: where,
    select: select
  });

  const totalCount = await database.user.count({ where });

  return {
    totalCount: totalCount,
    list: userList
  };
};

export const getUser = async (params = {}, user = {}) => {
  const { id } = params;

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const existUser = await database.user.findUnique({
    where: { id: id },
    select: select
  });

  if (!existUser) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, 'user not found');
  }

  return existUser;
};

export const createUser = async (body = {}, user = {}) => {
  const {
    email, password, name
  } = body;

  const existUser = await database.user.findUnique({ where: { email: email } });
  if (existUser) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_CONFLICT_409, 'user already exists');
  }

  const cryptedPassword = await bcrypt.hash(password, COMMON_DEFAULTS.SALT_OR_ROUNDS_DEFAULT);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const createdUser = await database.user.create({
    data: {
      ...body,
      password: cryptedPassword,
    },
    select: select
  });

  return createdUser;
};

export const updateUser = async (params = {}, body = {}, user = {}) => {
  const { id } = params;
  const { password, name } = body;

  const existUser = await getUser(params, user);

  permission.checkUserInactive(existUser);
  permission.checkUserAnonymous(existUser);

  if (password) {
    cryptedPassword = await bcrypt.hash(password, COMMON_DEFAULTS.SALT_OR_ROUNDS_DEFAULT);
  }

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const updatedUser = await database.user.update({
    where: { id: id },
    data: { password: password, name: name },
    select: select
  });

  return updatedUser;
};

export const deactivateUser = async (params = {}, user = {}) => {
  const { id } = params;

  const existUser = await getUser(params, user);

  permission.checkUserAnonymous(existUser);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const results = await runUserTransaction(
    existUser.id,
    {
      status: COMMON_STATUSES.INACTIVE,
      deletedAt: new Date()
    },
    database.user.update({
      where: { id: existUser.id },
      data: {
        status: COMMON_STATUSES.INACTIVE,
        deletedAt: new Date()
      },
      select: select
    })
  );

  const deactivatedUser = results.pop();

  return deactivatedUser;
};

export const activateUser = async (params = {}, user = {}) => {
  const { id } = params;

  const existUser = await getUser(params, user);
  permission.checkUserAnonymous(existUser);

  if (existUser.deletedAt === null) {
    return existUser;
  }

  const isMaster = permission.isMaster(user);

  const select = getSelect(isMaster);

  const results = await runUserTransaction(
    existUser.id,
    {
      status: COMMON_STATUSES.ACTIVE,
      deletedAt: null
    },
    database.user.update({
      where: { id: existUser.id },
      data: {
        status: COMMON_STATUSES.INACTIVE,
        deletedAt: null,
      },
      select: select
    })
  );

  const activatedUser = results.pop();

  return activatedUser;
}

// user 가 삭제되면 user 가 작성했던 모든 product, article, comment 는
// anonymous 계정에 귀속된다.
export const deleteUser = async (params = {}, user = {}) => {
  const { id } = params;

  await getUser(params, user);

  permission.checkUserAnonymous(existUser);

  const anonymous = await getAnonymous();
  if (!anonymous) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, 'anonymous not found');
  }

  const results = await runUserTransaction(
    id,
    { userId: anonymous.id },
    database.user.delete({
      where: { id: id },
      select: SELECT_DELETE
    })
  );

  const deletedUser = results.pop();

  return deletedUser;
};