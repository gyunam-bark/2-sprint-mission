import { COMMON_SORT, PRISMA_OPTION, USER_STATUS } from '../constant/constant.js';
import prisma from '../prisma/prisma.js';
import {
  runActivateUserTransaction,
  runDeactivateUserTransaction,
  runDeleteUserTransaction,
} from '../prisma/transaction.js';
import { comparePassword } from '../util/crypt-util.js';
import { HttpError } from '../util/error-util.js';
import {
  checkExistUserWithEmail,
  getArchivedUser,
  getExistUser,
  getMasterUser,
  isUserMaster,
  isUserOwner,
} from '../util/user-util.js';
import { USERS_SELECT_MASTER, USERS_SELECT_OWNER, USERS_SELECT_USER } from './users-select.js';

export const getUserDetail = async (param, user) => {
  try {
    const { id } = param;

    const existUser = await getExistUser({ id });

    const queryOptions = {
      where: { id },
    };

    if (isUserMaster(user)) {
      queryOptions.select = USERS_SELECT_MASTER;
    } else if (isUserOwner(user.id, existUser.id)) {
      queryOptions.select = USERS_SELECT_OWNER;
    } else {
      queryOptions.select = USERS_SELECT_USER;
    }

    const detailedUser = await prisma.user.findUnique(queryOptions);

    return detailedUser;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (param, body, user) => {
  try {
    const { id } = param;
    const { email, nickname, password, image } = body;

    const existUser = await getExistUser({ id });

    if (email) {
      await checkExistUserWithEmail(email);
    }

    if (!isUserMaster(user) && !isUserOwner(user.id, existUser.id)) {
      throw new HttpError(400, '권한이 없습니다.');
    }

    const updatedUser = await prisma.user.update({
      where: { id: existUser.id },
      data: {
        email,
        nickname,
        password,
        image,
      },
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const deactivateUser = async (param) => {
  try {
    const { id } = param;

    const existUser = await getExistUser({ id });

    const results = await runDeactivateUserTransaction(existUser.id);

    const deactivatedUser = results.pop();

    return deactivatedUser;
  } catch (error) {
    throw error;
  }
};

export const activateUser = async (param) => {
  try {
    const { id } = param;

    const existUser = await getExistUser({ id });

    const results = await runActivateUserTransaction(existUser.id);

    const activatedUser = results.pop();

    return activatedUser;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (param, body, master) => {
  try {
    const { id } = param;
    const { password } = body;

    const existUser = await getExistUser({ id });

    const masterUser = await getMasterUser(master);

    await comparePassword(password, masterUser.password);

    const anonymousUser = await getArchivedUser();

    const results = await runDeleteUserTransaction(existUser.id, anonymousUser.id);

    const deletedUser = results.pop();

    return deletedUser;
  } catch (error) {
    throw error;
  }
};

// 잠금 해제
export const unlock = async (param) => {
  try {
    const { id } = param;

    const existUser = await getExistUser({ id });

    await prisma.user.update({
      where: { id: existUser.id },
      data: {
        loginAttempts: 0,
        status: USER_STATUS.ACTIVE,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getUserList = async (query) => {
  try {
    const { skip, take, sort, keyword } = query;

    const keywordFilter = keyword
      ? {
          OR: [
            { nickname: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
            { email: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
          ],
        }
      : {};

    const where = {
      ...keywordFilter,
    };

    const prismaOrderBy = sort === COMMON_SORT.LATEST ? PRISMA_OPTION.ORDER_BY_DESCEND : PRISMA_OPTION.ORDER_BY_ASCEND;

    const orderBy = sort
      ? {
          createdAt: prismaOrderBy,
        }
      : {};

    const userList = await prisma.user.findMany({
      skip,
      take,
      orderBy,
      where,
    });
    const totalCount = await prisma.user.count({ where });

    return {
      totalCount: totalCount,
      list: userList,
    };
  } catch (error) {
    throw error;
  }
};
