import { Hono } from 'hono';
import {
  validate,
  getUserListSchema,
  getUserDetailSchema,
  updateUserSchema,
  deleteUserSchema,
  deactivateUserSchema,
  activateUserSchema,
  unlockUserSchema,
} from '../middleware/validate-middleware.js';
import { allow } from '../middleware/role-middleware.js';
import { USER_ROLE } from '../constant/constant.js';
import {
  handleActivateUser,
  handleDeactivateUser,
  handleDeleteUser,
  handleGetUserDetail,
  handleGetUserList,
  handleUnlock,
  handleUpdateUser,
} from './users-controller.js';

const users = new Hono();

// 유저 디테일
users.get('/:id', allow([USER_ROLE.USER]), validate(getUserDetailSchema), handleGetUserDetail);
// 유저 수정(마스터와 본인만 가능)
users.patch('/:id', allow([USER_ROLE.USER]), validate(updateUserSchema), handleUpdateUser);
// 유저 비활성화(마스터만 가능)
users.post('/:id/deactivate', allow([USER_ROLE.MASTER]), validate(deactivateUserSchema), handleDeactivateUser);
// 유저 활성화(마스터만 가능)
users.post('/:id/activate', allow([USER_ROLE.MASTER]), validate(activateUserSchema), handleActivateUser);
// 유저 삭제(마스터만 가능)
users.delete('/:id', allow([USER_ROLE.MASTER]), validate(deleteUserSchema), handleDeleteUser);

// 잠금해제
users.post('/:id/unlock', allow([USER_ROLE.MASTER]), validate(unlockUserSchema), handleUnlock);

// 유저 목록(마스터만 가능)
users.get('/', allow([USER_ROLE.MASTER]), validate(getUserListSchema), handleGetUserList);

export default users;
