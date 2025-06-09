import express from 'express'
import * as articleController from './article.controllers.mjs';
import { setAllowedRole } from '../middleware/auth.middleware.mjs'
import USER_ROLES from '../user/user.role.mjs'

const articleRouter = express.Router()

articleRouter.route('/')
  // 게시글 생성
  .post(setAllowedRole([USER_ROLES.USER]), articleController.handleCreateArticle)
  // 게시글 목록
  .get(setAllowedRole([USER_ROLES.USER]), articleController.handleGetArticleList);

articleRouter.route('/:id')
  // 게시글 정보
  .get(setAllowedRole([USER_ROLES.USER]), articleController.handleGetArticle)
  // 게시글 정보 최신화
  .patch(setAllowedRole([USER_ROLES.OWNER]), articleController.handleUpdateArticle)
  // 게시글 완전 삭제
  .delete(setAllowedRole([USER_ROLES.MASTER]), articleController.handleDeleteArticle);

articleRouter.route('/deactivate/:id')
  // 게시글 비활성화
  .patch(setAllowedRole([USER_ROLES.OWNER]), articleController.handleDeactivateArticle);

articleRouter.route('/activate/:id')
  // 게시글 활성화
  .patch(setAllowedRole([USER_ROLES.MASTER]), articleController.handleActivateArticle);

export default articleRouter;