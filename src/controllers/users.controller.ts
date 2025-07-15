import { RequestHandler } from 'express';
import { successResponse } from '../utils/response.util';
import {
  getUserDetail,
  getUserList,
  updateUser,
  deactivateUser,
  activateUser,
  lockUser,
  unlockUser,
  deleteUser,
  getProductList,
  getArticleList,
} from '../services/users.service';
import {
  ActivateUserRequest,
  DeactivateUserRequest,
  DeleteUserRequest,
  GetUserDetailRequset,
  GetUserListRequest,
  LockUserRequest,
  UnlockUserRequest,
  UpdateUserRequset,
} from '../types/user.type';
import { getUser } from '../utils/user.util';
import { GetProductListRequest } from '../types/product.type';
import { GetArticleListRequest } from '../types/article.type';

export const handleGetUserList: RequestHandler = async (req, res, next) => {
  const data = await getUserList(req.validated as GetUserListRequest);

  res.status(200).json(successResponse(data));
};

export const handleGetUserDetail: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await getUserDetail(user, req.validated as GetUserDetailRequset);

  res.status(200).json(successResponse(data));
};

export const handleUpdateUser: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await updateUser(user, req.validated as UpdateUserRequset);

  res.status(200).json(successResponse(data));
};

export const handleDeactivateUser: RequestHandler = async (req, res, next) => {
  const data = await deactivateUser(req.validated as DeactivateUserRequest);

  res.status(200).json(successResponse(data));
};

export const handleActivateUser: RequestHandler = async (req, res, next) => {
  const data = await activateUser(req.validated as ActivateUserRequest);

  res.status(200).json(successResponse(data));
};

export const handleLockUser: RequestHandler = async (req, res, next) => {
  const data = await lockUser(req.validated as LockUserRequest);

  res.status(200).json(successResponse(data));
};

export const handleUnlockUser: RequestHandler = async (req, res, next) => {
  const data = await unlockUser(req.validated as UnlockUserRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeleteUser: RequestHandler = async (req, res, next) => {
  const master = getUser(req);
  const data = await deleteUser(master, req.validated as DeleteUserRequest);

  res.status(200).json(successResponse(data));
};

export const handleGetProductList: RequestHandler = async (req, res, next) => {
  const data = await getProductList(req.validated as GetProductListRequest);

  res.status(200).json(successResponse(data));
};

export const handleGetArticleList: RequestHandler = async (req, res, next) => {
  const data = await getArticleList(req.validated as GetArticleListRequest);

  res.status(200).json(successResponse(data));
};
