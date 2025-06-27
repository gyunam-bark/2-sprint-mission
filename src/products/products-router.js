import { Hono } from 'hono';
import {
  handleActivateProduct,
  handleCreateProduct,
  handleCreateProductComment,
  handleDeactivateProduct,
  handleDeleteProduct,
  handleGetCommentList,
  handleGetProductDetail,
  handleGetProductList,
  handleLikeProduct,
  handleUpdateProduct,
} from './products-controller.js';
import { allow } from '../middleware/role-middleware.js';
import { USER_ROLE } from '../constant/constant.js';
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
} from '../middleware/validate-middleware.js';

const products = new Hono();

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
products.get('/:id/comments', allow([USER_ROLE.USER]), validate(getProductCommentListSchema), handleGetCommentList);

export default products;
