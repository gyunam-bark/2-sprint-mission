import { USER_ROLE, USER_STATUS } from '../constant/constant.js';
import prisma from '../prisma/prisma.js';
import { ConflictError, ForbiddenError, LockedError, NotFoundError } from './error-util.js';

const C_KEYWORD = 'user';

export const getUser = async (c) => await c.get(C_KEYWORD);
export const setUser = async (c, payload) => await c.set(C_KEYWORD, payload);
export const isUserMaster = (user) => user.role === USER_ROLE.MASTER;
export const isUserOwner = (requestIp, ownerIp) => requestIp === ownerIp;

export const getExistUser = async (where) => {
  const existUser = await prisma.user.findUnique({
    where,
  });
  if (!existUser) {
    throw new NotFoundError();
  }
  return existUser;
};

export const checkExistUserWithEmail = async (email) => {
  const existUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existUser) {
    throw new ConflictError();
  }
};

export const getMasterUser = async (master) => {
  const masterUser = await prisma.user.findUnique({
    where: { id: master.id },
  });
  if (!masterUser) {
    throw new NotFoundError();
  }
  return masterUser;
};

export const getArchivedUser = async () => {
  const archiveUser = await prisma.user.findFirst({
    where: { isArchiveUser: true },
  });
  if (!archiveUser) {
    throw new NotFoundError();
  }
  return archiveUser;
};

export const checkUserLock = (user) => {
  if (user.status === USER_STATUS.LOCK) {
    throw new LockedError();
  }
};

export const checkUserInactive = (user) => {
  if (user.status === USER_STATUS.INACTIVE) {
    throw new ForbiddenError();
  }
};
