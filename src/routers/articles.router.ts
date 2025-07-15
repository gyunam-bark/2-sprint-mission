import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import {
  activateArticleSchema,
  createArticleCommentSchema,
  createArticleSchema,
  deactivateArticleSchema,
  deleteArticleSchema,
  getArticleCommentListSchema,
  getArticleDetailSchema,
  getArticleListSchema,
  likeArticleSchema,
  updateArticleSchema,
  validate,
} from '../middlewares/validate.middleware';
import {
  handleActivateArticle,
  handleCreateArticle,
  handleCreateArticleComment,
  handleDeactivateArticle,
  handleDeleteArticle,
  handleGetArticleCommentList,
  handleGetArticleDetail,
  handleGetArticleList,
  handleLikeArticle,
  handleUpdateArticle,
} from '../controllers/articles.controller';

const articles = express.Router();

articles.post('/', allow([USER_ROLE.USER]), validate(createArticleSchema), handleCreateArticle);
articles.get('/', allow([USER_ROLE.USER]), validate(getArticleListSchema), handleGetArticleList);
articles.get('/:id', allow([USER_ROLE.USER]), validate(getArticleDetailSchema), handleGetArticleDetail);
articles.patch('/:id', allow([USER_ROLE.USER]), validate(updateArticleSchema), handleUpdateArticle);
articles.post('/:id/deactivate', allow([USER_ROLE.USER]), validate(deactivateArticleSchema), handleDeactivateArticle);
articles.post('/:id/activate', allow([USER_ROLE.MASTER]), validate(activateArticleSchema), handleActivateArticle);
articles.delete('/:id', allow([USER_ROLE.MASTER]), validate(deleteArticleSchema), handleDeleteArticle);
articles.post('/:id/like', allow([USER_ROLE.USER]), validate(likeArticleSchema), handleLikeArticle);

articles.post(
  '/:id/comments',
  allow([USER_ROLE.USER]),
  validate(createArticleCommentSchema),
  handleCreateArticleComment
);
articles.get(
  '/:id/comments',
  allow([USER_ROLE.USER]),
  validate(getArticleCommentListSchema),
  handleGetArticleCommentList
);

export default articles;
