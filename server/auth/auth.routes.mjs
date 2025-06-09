import express from 'express';
import USER_ROLES from '../user/user.role.mjs';
import { setAllowedRole } from '../middleware/auth.middleware.mjs'
import authControllers from './auth.controllers.mjs';

const authRouter = express.Router();

authRouter.route('/')
  // 로그인
  .post(setAllowedRole([USER_ROLES.PUBLIC]), authControllers.handleLogin);

export default authRouter;