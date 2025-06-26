import { getParamFromContext } from '../util/from-util.js';
import { getUser } from '../util/user-util.js';
import { getValidate } from '../util/validate-util.js';
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getUserDetail,
  getUserList,
  unlock,
  updateUser,
} from './users-service.js';

export const handleGetUserDetail = async (c) => {
  try {
    const { param } = await getValidate(c);
    const user = await getUser(c);

    const userDetail = await getUserDetail(param, user);

    const response = {
      success: true,
      data: userDetail,
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

    const deactivatedUser = await deactivateUser(param);

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

    const activatedUser = await activateUser(param);

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
