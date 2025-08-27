import express from 'express';
import { allow } from '../middlewares/allow.middleware';
import { USER_ROLE } from '../enums/user.enum';
import {
  getNotificationListSchema,
  getNotificationSchema,
  readNotificationSchema,
  validate,
} from '../middlewares/validate.middleware';
import {
  handleGetNotification,
  handleGetNotificationList,
  handleGetNotificationUnreadList,
  handleReadNotification,
} from '../controllers/notifications.controller';

const notifications = express.Router();

// 알림 디테일 정보를 받으면, 읽은 것으로 고려
notifications.get(
  '/notifications',
  allow([USER_ROLE.USER]),
  validate(getNotificationListSchema),
  handleGetNotificationList
);
notifications.get(
  '/notifications/unread',
  allow([USER_ROLE.USER]),
  validate(getNotificationListSchema),
  handleGetNotificationUnreadList
);
notifications.get(
  '/notifications/:id',
  allow([USER_ROLE.USER]),
  validate(getNotificationSchema),
  handleGetNotification
);
// 수동 읽음 처리
notifications.patch(
  '/notifications/:id',
  allow([USER_ROLE.USER]),
  validate(readNotificationSchema),
  handleReadNotification
);

export default notifications;
