import express from 'express';

import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import {
  activateUserSchema,
  deactivateUserSchema,
  deleteUserSchema,
  getArticleListSchema,
  getProductListSchema,
  getUserDetailSchema,
  getUserListSchema,
  lockUserSchema,
  unlockUserSchema,
  updateUserSchema,
  validate,
} from '../middlewares/validate.middleware';
import {
  handleActivateUser,
  handleDeactivateUser,
  handleDeleteUser,
  handleGetArticleList,
  handleGetProductList,
  handleGetUserDetail,
  handleGetUserList,
  handleLockUser,
  handleUnlockUser,
  handleUpdateUser,
} from '../controllers/users.controller';

const users = express.Router();

users.get('/', allow([USER_ROLE.USER]), validate(getUserListSchema), handleGetUserList);
users.get('/:id', allow([USER_ROLE.USER]), validate(getUserDetailSchema), handleGetUserDetail);
users.patch('/:id', allow([USER_ROLE.USER]), validate(updateUserSchema), handleUpdateUser);
users.post('/:id/deactivate', allow([USER_ROLE.MASTER]), validate(deactivateUserSchema), handleDeactivateUser);
users.post('/:id/activate', allow([USER_ROLE.MASTER]), validate(activateUserSchema), handleActivateUser);
users.post('/:id/lock', allow([USER_ROLE.MASTER]), validate(lockUserSchema), handleLockUser);
users.post('/:id/unlock', allow([USER_ROLE.MASTER]), validate(unlockUserSchema), handleUnlockUser);
users.delete('/:id', allow([USER_ROLE.MASTER]), validate(deleteUserSchema), handleDeleteUser);

users.get('/:id/products', allow([USER_ROLE.USER]), validate(getProductListSchema), handleGetProductList);
users.get('/:id/articles', allow([USER_ROLE.USER]), validate(getArticleListSchema), handleGetArticleList);

export default users;
