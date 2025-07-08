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
  getProductListSchema,
  getArticleListSchema,
} from '../middleware/validate-middleware.js';
import { allow } from '../middleware/role-middleware.js';
import { USER_ROLE } from '../constant/constant.js';
import {
  handleActivateUser,
  handleDeactivateUser,
  handleDeleteUser,
  handleGetArticleList,
  handleGetProductList,
  handleGetUserDetail,
  handleGetUserList,
  handleUnlock,
  handleUpdateUser,
} from './users-controller.js';

const users = new Hono();

users.get('/', allow([USER_ROLE.MASTER]), validate(getUserListSchema), handleGetUserList);
users.get('/:id', allow([USER_ROLE.USER]), validate(getUserDetailSchema), handleGetUserDetail);
users.patch('/:id', allow([USER_ROLE.USER]), validate(updateUserSchema), handleUpdateUser);
users.post('/:id/deactivate', allow([USER_ROLE.MASTER]), validate(deactivateUserSchema), handleDeactivateUser);
users.post('/:id/activate', allow([USER_ROLE.MASTER]), validate(activateUserSchema), handleActivateUser);
users.delete('/:id', allow([USER_ROLE.MASTER]), validate(deleteUserSchema), handleDeleteUser);
users.post('/:id/unlock', allow([USER_ROLE.MASTER]), validate(unlockUserSchema), handleUnlock);

users.get('/:id/products', allow([USER_ROLE.USER]), validate(getProductListSchema), handleGetProductList);
users.get('/:id/articles', allow([USER_ROLE.USER]), validate(getArticleListSchema), handleGetArticleList);

export default users;
