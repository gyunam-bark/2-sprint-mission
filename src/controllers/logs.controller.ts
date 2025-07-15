import { RequestHandler } from 'express';
import { successResponse } from '../utils/response.util';
import { deleteLog, getLogList } from '../services/logs.service';
import { getUser } from '../utils/user.util';
import { DeleteLogRequest, GetLogListRequest } from '../types/log.type';

export const handleGetLogList: RequestHandler = async (req, res, next) => {
  const data = await getLogList(req.validated as GetLogListRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeleteLog: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await deleteLog(user, req.validated as DeleteLogRequest);

  res.status(200).json(successResponse(data));
};
