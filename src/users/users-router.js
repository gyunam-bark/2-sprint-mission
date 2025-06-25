import { Hono } from 'hono';
import { validate, getUserListSchema, getUserDetailSchema } from '../middleware/validate-middleware.js';
import { allow } from '../middleware/role-middleware.js';
import USER_ROLE from '../common/user-role.js';
import { handleGetUserDetail, handleGetUserList } from './users-controller.js';

const users = new Hono();

users.get('/:id', allow([USER_ROLE.USER]), validate(getUserDetailSchema), handleGetUserDetail);
users.get('/', allow([USER_ROLE.MASTER]), validate(getUserListSchema), handleGetUserList);

export default users;
