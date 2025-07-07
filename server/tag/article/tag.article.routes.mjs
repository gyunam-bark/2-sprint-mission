import express from 'express';
import * as articleTagController from './tag.article.controllers.mjs'
import USER_ROLES from '../../user/user.role.mjs';
import { setAllowedRole } from '../../middleware/auth.middleware.mjs'

const articleTagRouter = express.Router();

articleTagRouter.route('/')
  // 제품 태그 생성
  .post(setAllowedRole([USER_ROLES.MASTER]), articleTagController.handleCreateTag)
  // 제품 태그 목록
  .get(setAllowedRole([USER_ROLES.USER]), articleTagController.handleGetTagList);

articleTagRouter.route('/:id')
  // 제품 태그 정보
  .get(setAllowedRole([USER_ROLES.USER]), articleTagController.handleGetTag)
  // 제품 태그 정보 최신화
  .patch(setAllowedRole([USER_ROLES.MASTER]), articleTagController.handleUpdateTag)
  // 제품 태그 완전 삭제
  .delete(setAllowedRole([USER_ROLES.MASTER]), articleTagController.handleDeleteTag);

articleTagRouter.route('/deactivate/:id')
  // 제품 태그 비활성화
  .patch(setAllowedRole([USER_ROLES.MASTER]), articleTagController.handleDeactivateTag);

articleTagRouter.route('/activate/:id')
  // 제품 태그 활성화
  .patch(setAllowedRole([USER_ROLES.MASTER]), articleTagController.handleActivateTag);

export default articleTagRouter;