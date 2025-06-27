import { getUser } from '../util/user-util.js';
import { getValidate } from '../util/validate-util.js';
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getArticleList,
  getProductList,
  getUserDetail,
  getUserList,
  unlock,
  updateUser,
} from './users-service.js';

export const handleGetUserDetail = async (c) => {
  try {
    const { param } = await getValidate(c);
    const user = await getUser(c);

    const gotUserDetail = await getUserDetail(param, user);

    const response = {
      success: true,
      data: gotUserDetail,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleUpdateUser = async (c) => {
  try {
    const { param, body } = await getValidate(c);
    const user = await getUser(c);

    const updatedUser = await updateUser(param, body, user);

    const response = {
      success: true,
      data: updatedUser,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleDeleteUser = async (c) => {
  try {
    const { param, body } = await getValidate(c);
    const master = await getUser(c);

    const deletedUser = await deleteUser(param, body, master);

    const response = {
      success: true,
      data: deletedUser,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleDeactivateUser = async (c) => {
  try {
    const { param } = await getValidate(c);
    const user = getUser(c);

    const deactivatedUser = await deactivateUser(param, user);

    const response = {
      success: true,
      data: deactivatedUser,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleActivateUser = async (c) => {
  try {
    const { param } = await getValidate(c);
    const user = getUser(c);

    const activatedUser = await activateUser(param, user);

    const response = {
      success: true,
      data: activatedUser,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleUnlock = async (c) => {
  try {
    const param = await getValidate(c);

    await unlock(param);

    const response = {
      success: true,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleGetUserList = async (c) => {
  try {
    const { query } = await getValidate(c);

    const gotUserList = await getUserList(query);

    const response = {
      success: true,
      data: gotUserList,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleGetProductList = async (c) => {
  try {
    const { param, query } = await getValidate(c);

    const gotProductList = await getProductList(param, query);

    const response = {
      success: true,
      data: gotProductList,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};

export const handleGetArticleList = async (c) => {
  try {
    const { param, query } = await getValidate(c);

    const gotArticleList = await getArticleList(param, query);

    const response = {
      success: true,
      data: gotArticleList,
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};
