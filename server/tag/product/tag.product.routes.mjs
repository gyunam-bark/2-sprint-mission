import express from 'express'
import * as productTagController from './tag.product.controllers.mjs'
import { setAllowedRole } from '../../middleware/auth.middleware.mjs'
import USER_ROLES from '../../user/user.role.mjs'

const productTagRouter = express.Router();

productTagRouter.route('/')
  // 제품 태그 생성
  .post(setAllowedRole([USER_ROLES.MASTER]), productTagController.handleCreateTag)
  // 제품 태그 목록
  .get(setAllowedRole([USER_ROLES.USER]), productTagController.handleGetTagList);

productTagRouter.route('/:id')
  // 제품 태그 정보
  .get(setAllowedRole([USER_ROLES.USER]), productTagController.handleGetTag)
  // 제품 태그 정보 최신화
  .patch(setAllowedRole([USER_ROLES.MASTER]), productTagController.handleUpdateTag)
  // 제품 태그 완전 삭제
  .delete(setAllowedRole([USER_ROLES.MASTER]), productTagController.handleDeleteTag);

productTagRouter.route('/deactivate/:id')
  // 제품 태그 비활성화
  .patch(setAllowedRole([USER_ROLES.MASTER]), productTagController.handleDeactivateTag);

productTagRouter.route('/activate/:id')
  // 제품 태그 활성화
  .patch(setAllowedRole([USER_ROLES.MASTER]), productTagController.handleActivateTag);

export default productTagRouter;