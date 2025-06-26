import { Hono } from 'hono';
import { handleLogin, handleLogout, handleRefresh, handleRegister, handleWithdraw } from './auth-controller.js';
import { loginSchema, registerSchema, validate, withdrawSchema } from '../middleware/validate-middleware.js';
import { checkBlacklistToken } from '../middleware/blacklist-middleware.js';
import { allow } from '../middleware/role-middleware.js';
import { USER_ROLE } from '../constant/constant.js';

const auth = new Hono();

auth.post('/register', allow([USER_ROLE.PUBLIC]), validate(registerSchema), handleRegister);
auth.post('/withdraw', allow([USER_ROLE.USER]), validate(withdrawSchema), handleWithdraw);
auth.post('/login', allow([USER_ROLE.PUBLIC]), validate(loginSchema), handleLogin);
auth.post('/logout', allow([USER_ROLE.USER]), handleLogout);
auth.post('/refresh', allow([USER_ROLE.USER]), checkBlacklistToken, handleRefresh);

export default auth;
