import { Hono } from 'hono';
import { allow } from '../middleware/role-middleware.js';
import { USER_ROLE } from '../constant/constant.js';
import {
  activateArticleCommentSchema,
  activateProductCommentSchema,
  deactivateArticleCommentSchema,
  deactivateProductCommentSchema,
  deleteArticleCommentSchema,
  deleteProductCommentSchema,
  likeArticleCommentSchema,
  likeProductCommentSchema,
  updateArticleCommentSchema,
  updateProductCommentSchema,
  validate,
} from '../middleware/validate-middleware.js';
import {
  handleActivateArticleComment,
  handleActivateProductComment,
  handleDeactivateArticleComment,
  handleDeactivateProductComment,
  handleDeleteArticleComment,
  handleDeleteProductComment,
  handleLikeArticleComment,
  handleLikeProductComment,
  handleUpdateArticleComment,
  handleUpdateProductComment,
} from './comments-controller.js';

const comments = new Hono();

comments.patch(
  '/product/:id',
  allow([USER_ROLE.USER]),
  validate(updateProductCommentSchema),
  handleUpdateProductComment
);
comments.post(
  '/product/:id/deactivate',
  allow([USER_ROLE.USER]),
  validate(deactivateProductCommentSchema),
  handleDeactivateProductComment
);
comments.post(
  '/product/:id/activate',
  allow([USER_ROLE.MASTER]),
  validate(activateProductCommentSchema),
  handleActivateProductComment
);
comments.delete(
  '/product/:id',
  allow([USER_ROLE.MASTER]),
  validate(deleteProductCommentSchema),
  handleDeleteProductComment
);
comments.post(
  '/product/:id/like',
  allow([USER_ROLE.USER]),
  validate(likeProductCommentSchema),
  handleLikeProductComment
);

comments.patch(
  '/article/:id',
  allow([USER_ROLE.USER]),
  validate(updateArticleCommentSchema),
  handleUpdateArticleComment
);
comments.post(
  '/article/:id/deactivate',
  allow([USER_ROLE.USER]),
  validate(deactivateArticleCommentSchema),
  handleDeactivateArticleComment
);
comments.post(
  '/article/:id/activate',
  allow([USER_ROLE.MASTER]),
  validate(activateArticleCommentSchema),
  handleActivateArticleComment
);
comments.delete(
  '/article/:id',
  allow([USER_ROLE.MASTER]),
  validate(deleteArticleCommentSchema),
  handleDeleteArticleComment
);
comments.post(
  '/article/:id/like',
  allow([USER_ROLE.USER]),
  validate(likeArticleCommentSchema),
  handleLikeArticleComment
);

export default comments;
