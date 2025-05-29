import express from 'express'
import * as userControllers from './user.controllers.mjs';
import { setAllowedRole } from '../middleware/auth.middleware.mjs'
import USER_ROLES from './user.role.mjs'

const userRouter = express.Router()

userRouter.route('/')
  // 회원가입
  .post(setAllowedRole([USER_ROLES.PUBLIC]), userControllers.handleCreateUser)
  // 사용자 목록
  .get(setAllowedRole([USER_ROLES.USER]), userControllers.handleGetUserList);

userRouter.route('/:id')
  // 사용자 정보
  .get(setAllowedRole([USER_ROLES.USER]), userControllers.handleGetUser)
  // 사용자 정보 최신화
  .patch(setAllowedRole([USER_ROLES.OWNER]), userControllers.handleUpdateUser)
  // 사용자 완전 삭제
  .delete(setAllowedRole([USER_ROLES.MASTER]), userControllers.handleDeleteUser);

userRouter.route('/deactivate/:id')
  // 사용자 비활성화
  .patch(setAllowedRole([USER_ROLES.OWNER]), userControllers.handleDeactivateUser);

userRouter.route('/activate/:id')
  // 사용자 활성화
  .patch(setAllowedRole([USER_ROLES.MASTER]), userControllers.handleActivateUser);

export default userRouter;