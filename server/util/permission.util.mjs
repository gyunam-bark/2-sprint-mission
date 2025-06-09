import COMMON_STATUSES from "../common/common.status.mjs";
import { errorWithStatus } from "../util/error.util.mjs";
import HTTP_STATUSES from '../common/http.status.mjs';
import USER_ROLES from '../user/user.role.mjs';

// 마스터 계정 유무
export const isMaster = (user) => {
  return user?.role === USER_ROLES.MASTER;
};

// 소유 계정 유무
export const isOwner = (user, targetId) => {
  return isMaster(user) || user?.userId === targetId;
};

// 익명 유저 유무
export const isAnonymous = (user) => {
  return user?.isAnonymous === true;
};

// isAnonymous(true) 일 경우 안됨.
export const checkUserAnonymous = (user) => {
  if (isAnonymous(user)) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_FORBIDDEN_403, 'modify not allowed on this user');
  }
};

// 비활성화 된 USER 일 경우 안됨.
export const checkUserInactive = (user) => {
  if (user.status == COMMON_STATUSES.INACTIVE) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, 'user not found');
  }
};