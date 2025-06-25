import { getUser } from '../util/user-util.js';
import { getValidate } from '../util/validate-util.js';
import { getUserDetail } from './users-service.js';

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

export const handleGetUserList = async (c) => {
  try {
    const { query } = await getValidate(c);

    const response = {
      success: true,
      data: {},
    };

    return c.json(response, 200);
  } catch (error) {
    throw error;
  }
};
