import { getUser } from '../util/user-util.js';
import { getValidate } from '../util/validate-util.js';
import {
  updateProductComment,
  deactivateProductComment,
  activateProductComment,
  deleteProductComment,
  updateArticleComment,
  deactivateArticleComment,
  activateArticleComment,
  deleteArticleComment,
  likeArticleComment,
  likeProductComment,
} from './comments-services.js';

export const handleUpdateProductComment = async (c) => {
  try {
    const { param, body } = await getValidate(c);
    const user = await getUser(c);

    const updatedProductComment = await updateProductComment(param, body, user);

    const response = {
      success: true,
      data: updatedProductComment,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleDeactivateProductComment = async (c) => {
  try {
    const { param } = await getValidate(c);

    const deactivatedProductComment = await deactivateProductComment(param);

    const response = {
      success: true,
      data: deactivatedProductComment,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleActivateProductComment = async (c) => {
  try {
    const { param, body } = await getValidate(c);
    const user = await getUser(c);

    const activatedProductComment = await activateProductComment(param, body, user);

    const response = {
      success: true,
      data: activatedProductComment,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleDeleteProductComment = async (c) => {
  try {
    const { param, body } = await getValidate(c);
    const user = await getUser(c);

    const deletedProductComment = await deleteProductComment(param, body, user);

    const response = {
      success: true,
      data: deletedProductComment,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleLikeProductComment = async (c) => {
  try {
    const { param } = await getValidate(c);
    const user = await getUser(c);

    const likedProductComment = await likeProductComment(param, user);

    const response = {
      success: true,
      data: likedProductComment,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleUpdateArticleComment = async (c) => {
  try {
    const { param, body } = await getValidate(c);
    const user = await getUser(c);

    const updatedArticleComment = await updateArticleComment(param, body, user);

    const response = {
      success: true,
      data: updatedArticleComment,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleDeactivateArticleComment = async (c) => {
  try {
    const { param } = await getValidate(c);
    const user = await getUser(c);

    const deactivatedArticleComment = await deactivateArticleComment(param, user);

    const response = {
      success: true,
      data: deactivatedArticleComment,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleActivateArticleComment = async (c) => {
  try {
    const { param } = await getValidate(c);
    const user = await getUser(c);

    const activatedArticleComment = await activateArticleComment(param, user);

    const response = {
      success: true,
      data: activatedArticleComment,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleDeleteArticleComment = async (c) => {
  try {
    const { param, body } = await getValidate(c);
    const user = await getUser(c);

    const deletedArticleComment = await deleteArticleComment(param, body, user);

    const response = {
      success: true,
      data: deletedArticleComment,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleLikeArticleComment = async (c) => {
  try {
    const { param } = await getValidate(c);
    const user = await getUser(c);

    const likedArticleComment = await likeArticleComment(param, user);

    const response = {
      success: true,
      data: likedArticleComment,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};
