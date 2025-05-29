import express from 'express'
import { setAllowedRole } from '../middleware/auth.middleware.mjs'
import USER_ROLES from '../user/user.role.mjs'
import * as productController from './product.controllers.mjs';

const productRouter = express.Router()

productRouter.route('/')
  // 제품 생성
  .post(setAllowedRole([USER_ROLES.USER]), productController.handleCreateProduct)
  // 제품 목록
  .get(setAllowedRole([USER_ROLES.USER]), productController.handleGetProductList);

productRouter.route('/:id')
  // 제품 정보
  .get(setAllowedRole([USER_ROLES.USER]), productController.handleGetProduct)
  // 제품 정보 최신화
  .patch(setAllowedRole([USER_ROLES.OWNER]), productController.handleUpdateProduct)
  // 제품 완전 삭제
  .delete(setAllowedRole([USER_ROLES.MASTER]), productController.handleDeleteProduct);

productRouter.route('/deactivate/:id')
  // 제품 비활성화
  .patch(setAllowedRole([USER_ROLES.OWNER]), productController.handleDeactivateProduct);

productRouter.route('/activate/:id')
  // 제품 활성화
  .patch(setAllowedRole([USER_ROLES.MASTER]), productController.handleActivateProduct);

export default productRouter;