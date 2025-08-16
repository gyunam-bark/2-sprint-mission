import { RequestHandler } from 'express';
import { getUser } from '../utils/user.util';
import { successResponse } from '../utils/response.util';
import { GetNoticeRequest } from '../types/notice.type';
import { getNotice } from '../services/notices.service';

export const handleGetNotice: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await getNotice(user, req.validated as GetNoticeRequest);

  res.status(200).json(successResponse(data));
};
