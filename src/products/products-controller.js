import { getUser } from '../util/user-util.js';
import { getValidate } from '../util/validate-util.js';
import {
  activateProduct,
  createProduct,
  createProductComment,
  deactivateProduct,
  deleteProduct,
  getProductCommentList,
  getProductDetail,
  getProductList,
  likeProduct,
  updateProduct,
} from './products-service.js';

export const handleCreateProduct = async (c) => {
  const { body } = await getValidate(c);
  const user = await getUser(c);

  const createdProduct = await createProduct(body, user);

  const response = {
    success: true,
    data: createdProduct,
  };

  return c.json(response, 200);
};

export const handleGetProductList = async (c) => {
  const { query } = await getValidate(c);
  const user = await getUser(c);

  const gotProductList = await getProductList(query, user);

  const response = {
    success: true,
    data: gotProductList,
  };

  return c.json(response, 200);
};

export const handleGetProductDetail = async (c) => {
  const { param } = await getValidate(c);
  const user = await getUser(c);

  const gotProductDetail = await getProductDetail(param, user);

  const response = {
    success: true,
    data: gotProductDetail,
  };

  return c.json(response, 200);
};

export const handleUpdateProduct = async (c) => {
  const { param, body } = await getValidate(c);
  const user = await getUser(c);

  const updatedProduct = await updateProduct(param, body, user);

  const response = {
    success: true,
    data: updatedProduct,
  };

  return c.json(response, 200);
};

export const handleDeactivateProduct = async (c) => {
  const { param } = await getValidate(c);
  const user = await getUser(c);

  const deactivatedProduct = await deactivateProduct(param, user);

  const response = {
    success: true,
    data: deactivatedProduct,
  };

  return c.json(response, 200);
};

export const handleActivateProduct = async (c) => {
  const { param } = await getValidate(c);

  const activatedProduct = await activateProduct(param);

  const response = {
    success: true,
    data: activatedProduct,
  };

  return c.json(response, 200);
};

export const handleDeleteProduct = async (c) => {
  const { param, body } = await getValidate(c);
  const user = await getUser(c);

  const deletedProduct = await deleteProduct(param, body, user);

  const response = {
    success: true,
    data: deletedProduct,
  };

  return c.json(response, 200);
};

export const handleLikeProduct = async (c) => {
  const { param } = await getValidate(c);
  const user = await getUser(c);

  const likedProduct = await likeProduct(param, user);

  const response = {
    success: true,
    data: likedProduct,
  };

  return c.json(response, 200);
};

export const handleGetCommentList = async (c) => {
  const { param, query } = await getValidate(c);
  const user = await getUser(c);

  const gotProductCommentList = await getProductCommentList(param, query, user);

  const response = {
    success: true,
    data: gotProductCommentList,
  };

  return c.json(response, 200);
};

export const handleCreateProductComment = async (c) => {
  const { param, body } = await getValidate(c);
  const user = await getUser(c);

  const createdProductComment = await createProductComment(param, body, user);

  const response = {
    success: true,
    data: createdProductComment,
  };

  return c.json(response, 200);
};
