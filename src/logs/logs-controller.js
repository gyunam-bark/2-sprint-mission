import { getUser } from '../util/user-util.js';
import { getValidate } from '../util/validate-util.js';
import { deleteLog, getLogList } from './log-service.js';

export const handleGetLogList = async (c) => {
  const { query } = await getValidate(c);

  const gotLogList = await getLogList(query);

  const response = {
    success: true,
    data: gotLogList,
  };

  return c.json(response);
};

export const handleDeleteLog = async (c) => {
  const { param, body } = await getValidate(d);
  const user = await getUser(c);

  const deletedLog = await deleteLog(param, body, user);

  const response = {
    success: true,
    data: deletedLog,
  };

  return c.json(response);
};
