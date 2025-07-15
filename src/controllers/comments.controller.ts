import { RequestHandler } from 'express';
import { successResponse } from '../utils/response.util';
import {
  activateArticleComment,
  activateProductComment,
  deactivateArticleComment,
  deactivateProductComment,
  deleteArticleComment,
  deleteProductComment,
  likeArticleComment,
  likeProductComment,
  updateArticleComment,
  updateProductComment,
} from '../services/comments.service';
import { getUser } from '../utils/user.util';
import {
  ActivateProductCommentRequest,
  DeactivateProductCommentRequest,
  DeleteProductCommentRequest,
  LikeProductCommentRequest,
  UpdateProductCommentRequest,
} from '../types/product-comment.type';
import {
  DeactivateArticleCommentRequest,
  DeleteArticleCommentRequest,
  LikeArticleCommentRequest,
  UpdateArticleCommentRequest,
} from '../types/article-comment.type';

export const handleUpdateProductComment: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await updateProductComment(user, req.validated as UpdateProductCommentRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeactivateProductComment: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await deactivateProductComment(user, req.validated as DeactivateProductCommentRequest);

  res.status(200).json(successResponse(data));
};

export const handleActivateProductComment: RequestHandler = async (req, res, next) => {
  const data = await activateProductComment(req.validated as ActivateProductCommentRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeleteProductComment: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await deleteProductComment(user, req.validated as DeleteProductCommentRequest);

  res.status(200).json(successResponse(data));
};

export const handleLikeProductComment: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await likeProductComment(user, req.validated as LikeProductCommentRequest);

  res.status(200).json(successResponse(data));
};

export const handleUpdateArticleComment: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await updateArticleComment(user, req.validated as UpdateArticleCommentRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeactivateArticleComment: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await deactivateArticleComment(user, req.validated as DeactivateArticleCommentRequest);

  res.status(200).json(successResponse(data));
};

export const handleActivateArticleComment: RequestHandler = async (req, res, next) => {
  const data = await activateArticleComment(req.validated as DeactivateArticleCommentRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeleteArticleComment: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await deleteArticleComment(user, req.validated as DeleteArticleCommentRequest);

  res.status(200).json(successResponse(data));
};

export const handleLikeArticleComment: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await likeArticleComment(user, req.validated as LikeArticleCommentRequest);

  res.status(200).json(successResponse(data));
};
