import { getUser } from '../util/user-util.js';
import { getValidate } from '../util/validate-util.js';
import {
  activateProduct,
  createProduct,
  deactivateProduct,
  deleteProduct,
  getProductDetail,
  getProductList,
  updateProduct,
} from './products-service.js';

export const handleCreateProduct = async (c) => {
  try {
    const { body } = await getValidate(c);
    const user = await getUser(c);

    const createdProduct = await createProduct(body, user);

    const response = {
      success: true,
      data: createdProduct,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleGetProductList = async (c) => {
  try {
    const { query } = await getValidate(c);
    const user = await getUser(c);

    const gotProductList = await getProductList(query, user);

    const response = {
      success: true,
      data: gotProductList,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleGetProductDetail = async (c) => {
  try {
    const { param } = await getValidate(c);
    const user = await getUser(c);

    const userDetail = await getProductDetail(param, user);

    const response = {
      success: true,
      data: userDetail,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleUpdateProduct = async (c) => {
  try {
    const { param, body } = await getValidate(c);
    const user = await getUser(c);

    const updatedProduct = await updateProduct(param, body, user);

    const response = {
      success: true,
      data: updatedProduct,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleDeactivateProduct = async (c) => {
  try {
    const { param } = await getValidate(c);
    const user = await getUser(c);

    const deactivatedProduct = await deactivateProduct(param, user);

    const response = {
      success: true,
      data: deactivatedProduct,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleActivateProduct = async (c) => {
  try {
    const { param } = await getValidate(c);

    const activatedProduct = await activateProduct(param);

    const response = {
      success: true,
      data: activatedProduct,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleDeleteProduct = async (c) => {
  try {
    const { param } = await getValidate(c);

    const deletedProduct = await deleteProduct(param);

    const response = {
      success: true,
      data: deletedProduct,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleGetCommentList = async (c) => {
  try {
  } catch (error) {
    throw error;
  }
};
