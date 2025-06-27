import { getUser } from '../util/user-util.js';
import { getValidate } from '../util/validate-util.js';
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
} from './articles-service.js';

export const handleCreateArticle = async (c) => {
  const { body } = await getValidate(c);
  const user = await getUser(c);

  const createdArticle = await createArticle(body, user);

  const response = {
    success: true,
    data: createdArticle,
  };

  return c.json(response, 200);
};

export const handleGetArticleList = async (c) => {
  const { query } = await getValidate(c);
  const user = await getUser(c);

  const gotArticleList = await getArticleList(query, user);

  const response = {
    success: true,
    data: gotArticleList,
  };

  return c.json(response, 200);
};

export const handleGetArticleDetail = async (c) => {
  const { param } = await getValidate(c);
  const user = await getUser(c);

  const gotArticleDetail = await getArticleDetail(param, user);

  const response = {
    success: true,
    data: gotArticleDetail,
  };

  return c.json(response, 200);
};

export const handleUpdateArticle = async (c) => {
  const { param, body } = await getValidate(c);
  const user = await getUser(c);

  const updatedArticle = await updateArticle(param, body, user);

  const response = {
    success: true,
    data: updatedArticle,
  };

  return c.json(response, 200);
};

export const handleDeactivateArticle = async (c) => {
  const { param } = await getValidate(c);
  const user = await getUser(c);

  const deactivatedArticle = await deactivateArticle(param, user);

  const response = {
    success: true,
    data: deactivatedArticle,
  };

  return c.json(response, 200);
};

export const handleActivateArticle = async (c) => {
  const { param } = await getValidate(c);
  const user = await getUser(c);

  const activatedArticle = await activateArticle(param, user);

  const response = {
    success: true,
    data: activatedArticle,
  };

  return c.json(response, 200);
};

export const handleDeleteArticle = async (c) => {
  const { param, body } = await getValidate(c);
  const user = await getUser(c);

  const deletedArticle = await deleteArticle(param, body, user);

  const response = {
    success: true,
    data: deletedArticle,
  };

  return c.json(response, 200);
};

export const handleLikeArticle = async (c) => {
  const { param } = await getValidate(c);
  const user = await getUser(c);

  const likedArticle = await likeArticle(param, user);

  const response = {
    success: true,
    data: likedArticle,
  };

  return c.json(response, 200);
};

export const handleGetArticleCommentList = async (c) => {
  const { param, body } = await getValidate(c);
  const user = await getUser(c);

  const getAritlceCommentList = await getArticleCommentList(param, body, user);

  const response = {
    success: true,
    data: getAritlceCommentList,
  };

  return c.json(response, 200);
};

export const handleCreateArticleComment = async (c) => {
  const { param, body } = await getValidate(c);
  const user = await getUser(c);

  const createdAritcleComment = await createArticleComment(param, body, user);

  const response = {
    success: true,
    data: createdAritcleComment,
  };

  return c.json(response, 200);
};
