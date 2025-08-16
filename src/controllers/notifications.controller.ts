import { RequestHandler } from 'express';
import { getUser } from '../utils/user.util';
import { successResponse } from '../utils/response.util';
import {
  GetNotificationListRequest,
  GetNotificationRequest,
  ReadNotificationRequest,
} from '../types/notification.type';
import {
  getNotification,
  getNotificationList,
  getNotificationUnreadList,
  updateNotificationRead,
} from '../services/notifications.service';

export const handleGetNotification: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await getNotification(user, req.validated as GetNotificationRequest);

  res.status(200).json(successResponse(data));
};

export const handleGetNotificationList: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await getNotificationList(user, req.validated as GetNotificationListRequest);

  res.status(200).json(successResponse(data));
};

export const handleGetNotificationUnreadList: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await getNotificationUnreadList(user, req.validated as GetNotificationListRequest);

  res.status(200).json(successResponse(data));
};

export const handleReadNotification: RequestHandler = async (req, res, next) => {
  const user = getUser(req);
  const data = await updateNotificationRead(user, req.validated as ReadNotificationRequest);

  res.status(200).json(successResponse(data));
};
