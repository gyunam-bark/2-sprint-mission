import { RequestHandler } from 'express';
import { successResponse } from '../utils/response.util';
import { getUser } from '../utils/user.util';
import {
  ActivateArticleRequest,
  CreateArticleRequest,
  DeactivateArticleRequest,
  DeleteArticleRequest,
  GetArticleDetailRequest,
  GetArticleListRequest,
  LikeArticleRequest,
  UpdateArticleRequest,
} from '../types/article.type';
import { CreateArticleCommentRequest, GetArticleCommentListRequest } from '../types/article-comment.type';
import {
  activateArticle,
  createArticle,
  createArticleComment,
  deactivateArticle,
  deleteArticle,
  getArticleCommentList,
  getArticleDetail,
  getArticleList,
  likeArticle,
  updateArticle,
} from '../services/articles.service';
import { Payload } from '../types/payload.type';

export const handleCreateArticle: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await createArticle(user, req.validated as CreateArticleRequest);

  res.status(201).json(successResponse(data));
};

export const handleGetArticleList: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await getArticleList(user, req.validated as GetArticleListRequest);

  res.status(200).json(successResponse(data));
};

export const handleGetArticleDetail: RequestHandler = async (req, res, next) => {
  const data = await getArticleDetail(req.validated as GetArticleDetailRequest);

  res.status(200).json(successResponse(data));
};

export const handleUpdateArticle: RequestHandler = async (req, res, next) => {
  const user = getUser(req);

  const data = await updateArticle(user, req.validated as UpdateArticleRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeactivateArticle: RequestHandler = async (req, res, next) => {
  const data = await deactivateArticle(req.validated as DeactivateArticleRequest);

  res.status(200).json(successResponse(data));
};

export const handleActivateArticle: RequestHandler = async (req, res, next) => {
  const data = await activateArticle(req.validated as ActivateArticleRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeleteArticle: RequestHandler = async (req, res, next) => {
  const master = getUser(req);
  const data = await deleteArticle(master, req.validated as DeleteArticleRequest);

  res.status(200).json(successResponse(data));
};

export const handleLikeArticle: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await likeArticle(user, req.validated as LikeArticleRequest);

  res.status(200).json(successResponse(data));
};

export const handleCreateArticleComment: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await createArticleComment(user, req.validated as CreateArticleCommentRequest);

  res.status(201).json(successResponse(data));
};

export const handleGetArticleCommentList: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await getArticleCommentList(user, req.validated as GetArticleCommentListRequest);

  res.status(200).json(successResponse(data));
};
