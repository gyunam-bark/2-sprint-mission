import { Hono } from 'hono';
import { allow } from '../middleware/role-middleware.js';
import { USER_ROLE } from '../constant/constant.js';
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
} from '../middleware/validate-middleware.js';
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
} from './articles-controller.js';

const articles = new Hono();

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
