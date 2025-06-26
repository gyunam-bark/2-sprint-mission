import { USER_ROLE, USER_STATUS } from '../constant/constant.js';
import prisma from '../prisma/prisma.js';
import { HttpError } from './error-util.js';

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
    throw new HttpError(404, '사용자를 찾을 수 없습니다.');
  }
  return existUser;
};

export const checkExistUserWithEmail = async (email) => {
  const existUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existUser) {
    throw new HttpError(409, '이미 해당 이메일로 가입된 사용자가 있습니다.');
  }
};

export const getMasterUser = async (master) => {
  const masterUser = await prisma.user.findUnique({
    where: { id: master.id },
  });
  if (!masterUser) {
    throw HttpError(404, '마스터 사용자를 찾을 수 없습니다.');
  }
  return masterUser;
};

export const getArchivedUser = async () => {
  const archiveUser = await prisma.user.findFirst({
    where: { isArchiveUser: true },
  });
  if (!archiveUser) {
    throw HttpError(404, '아카이브 유저를 찾을 수 없습니다.');
  }
  return archiveUser;
};

export const checkUserLock = (user) => {
  if (user.status === USER_STATUS.LOCK) {
    throw new HttpError(400, '계정이 잠겨있습니다.');
  }
};

export const checkUserInactive = (user) => {
  if (user.status === USER_STATUS.INACTIVE) {
    throw new HttpError(400, '접속할 수 없는 계정입니다.');
  }
};
