import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
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
} from '../middlewares/validate.middleware';
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
} from '../controllers/comments.controller';

const comments = express.Router();

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
