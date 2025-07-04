import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import {
  activateProductSchema,
  createProductCommentSchema,
  createProductSchema,
  deactivateProductSchema,
  deleteProductSchema,
  getProductCommentListSchema,
  getProductDetailSchema,
  getProductListSchema,
  likeProductSchema,
  updateProductSchema,
  validate,
} from '../middlewares/validate.middleware';
import {
  handleActivateProduct,
  handleCreateProduct,
  handleCreateProductComment,
  handleDeactivateProduct,
  handleDeleteProduct,
  handleGetProductCommentList,
  handleGetProductDetail,
  handleGetProductList,
  handleLikeProduct,
  handleUpdateProduct,
} from '../controllers/products.controller';

const products = express.Router();

products.post('/', allow([USER_ROLE.USER]), validate(createProductSchema), handleCreateProduct);
products.get('/', allow([USER_ROLE.USER]), validate(getProductListSchema), handleGetProductList);
products.get('/:id', allow([USER_ROLE.USER]), validate(getProductDetailSchema), handleGetProductDetail);
products.patch('/:id', allow([USER_ROLE.USER]), validate(updateProductSchema), handleUpdateProduct);
products.post('/:id/deactivate', allow([USER_ROLE.USER]), validate(deactivateProductSchema), handleDeactivateProduct);
products.post('/:id/activate', allow([USER_ROLE.MASTER]), validate(activateProductSchema), handleActivateProduct);
products.delete('/:id', allow([USER_ROLE.MASTER]), validate(deleteProductSchema), handleDeleteProduct);
products.post('/:id/like', allow([USER_ROLE.USER]), validate(likeProductSchema), handleLikeProduct);

products.post(
  '/:id/comments',
  allow([USER_ROLE.USER]),
  validate(createProductCommentSchema),
  handleCreateProductComment
);
products.get(
  '/:id/comments',
  allow([USER_ROLE.USER]),
  validate(getProductCommentListSchema),
  handleGetProductCommentList
);

export default products;
