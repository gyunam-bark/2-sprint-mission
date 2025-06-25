import prisma from '../prisma/prisma.js';
import { HttpError } from '../util/error-util.js';
import { isUserMaster, isUserOwner } from '../util/user-util.js';
import { USERS_SELECT_MASTER, USERS_SELECT_OWNER, USERS_SELECT_USER } from './users-select.js';

export const getUserDetail = async (param, user) => {
  try {
    const { id } = param;

    const existUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existUser) {
      throw HttpError(404, '사용자를 찾을 수 없습니다.');
    }

    const queryOptions = {
      where: { id },
    };

    if (isUserMaster(user.id)) {
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
