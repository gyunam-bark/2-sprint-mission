import express from 'express'
import * as articleCommentController from './comment.article.controllers.mjs';
import { setAllowedRole } from '../../middleware/auth.middleware.mjs'
import USER_ROLES from '../../user/user.role.mjs'

const articleCommentRouter = express.Router()

articleCommentRouter.route('/')
  // 게시글 댓글 생성
  .post(setAllowedRole([USER_ROLES.USER]), articleCommentController.handleCreateComment)
  // 게시글 댓글 목록
  .get(setAllowedRole([USER_ROLES.USER]), articleCommentController.handleGetCommentList);

articleCommentRouter.route('/:id')
  // 게시글 댓글 정보
  .get(setAllowedRole([USER_ROLES.USER]), articleCommentController.handleGetComment)
  // 게시글 댓글 정보 최신화
  .patch(setAllowedRole([USER_ROLES.OWNER]), articleCommentController.handleUpdateComment)
  // 게시글 댓글 완전 삭제
  .delete(setAllowedRole([USER_ROLES.MASTER]), articleCommentController.handleDeleteComment);

articleCommentRouter.route('/deactivate/:id')
  // 게시글 댓글 비활성화
  .patch(setAllowedRole([USER_ROLES.OWNER]), articleCommentController.handleDeactivateComment);

articleCommentRouter.route('/activate/:id')
  // 게시글 댓글 활성화
  .patch(setAllowedRole([USER_ROLES.MASTER]), articleCommentController.handleActivateComment);

export default articleCommentRouter;