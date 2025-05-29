import express from 'express'
import * as productCommentController from './comment.product.controllers.mjs';
import { setAllowedRole } from '../../middleware/auth.middleware.mjs'
import USER_ROLES from '../../user/user.role.mjs'

const productCommentRouter = express.Router()

productCommentRouter.route('/')
  // 제품 댓글 생성
  .post(setAllowedRole([USER_ROLES.USER]), productCommentController.handleCreateComment)
  // 제품 댓글 목록
  .get(setAllowedRole([USER_ROLES.USER]), productCommentController.handleGetCommentList);

productCommentRouter.route('/:id')
  // 제품 댓글 정보
  .get(setAllowedRole([USER_ROLES.USER]), productCommentController.handleGetComment)
  // 제품 댓글 정보 최신화
  .patch(setAllowedRole([USER_ROLES.OWNER]), productCommentController.handleUpdateComment)
  // 제품 댓글 완전 삭제
  .delete(setAllowedRole([USER_ROLES.MASTER]), productCommentController.handleDeleteComment);

productCommentRouter.route('/deactivate/:id')
  // 제품 댓글 비활성화
  .patch(setAllowedRole([USER_ROLES.OWNER]), productCommentController.handleDeactivateComment);

productCommentRouter.route('/activate/:id')
  // 제품 댓글 활성화
  .patch(setAllowedRole([USER_ROLES.MASTER]), productCommentController.handleActivateComment);

export default productCommentRouter;