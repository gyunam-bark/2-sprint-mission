import express from 'express';
import {
  validate,
  registerSchema,
  loginSchema,
  logoutSchema,
  withdrawSchema,
  refreshSchema,
} from '../middlewares/validate.middleware';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import {
  handleLogin,
  handleLogout,
  handleRefresh,
  handleReigster,
  handleWithdraw,
} from '../controllers/auth.controller';
import { checkBlacklist } from '../middlewares/blacklist.middleware';

const auth = express.Router();

auth.post('/register', allow([USER_ROLE.PUBLIC]), validate(registerSchema), handleReigster);
auth.post('/withdraw', allow([USER_ROLE.USER]), validate(withdrawSchema), handleWithdraw);
auth.post('/login', allow([USER_ROLE.PUBLIC]), validate(loginSchema), handleLogin);
auth.post('/logout', allow([USER_ROLE.USER]), validate(logoutSchema), handleLogout);
auth.post('/refresh', allow([USER_ROLE.USER]), checkBlacklist, validate(refreshSchema), handleRefresh);

export default auth;
