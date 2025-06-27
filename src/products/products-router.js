import { Hono } from 'hono';
import {
  handleActivateProduct,
  handleCreateProduct,
  handleDeactivateProduct,
  handleDeleteProduct,
  handleGetCommentList,
  handleGetProductDetail,
  handleGetProductList,
  handleUpdateProduct,
} from './products-controller.js';
import { allow } from '../middleware/role-middleware.js';
import { USER_ROLE } from '../constant/constant.js';
import {
  activateProductSchema,
  createProductSchema,
  deactivateProductSchema,
  deleteProductSchema,
  getProductCommentListSchema,
  getProductDetailSchema,
  getProductListSchema,
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

products.get('/:id/comments', allow([USER_ROLE.USER]), validate(getProductCommentListSchema), handleGetCommentList);

export default products;
