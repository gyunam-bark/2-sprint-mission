import { getNotificationEntity, getNotificationEntityList } from '../repositories/notifications.repository';
import { getUserReference } from '../repositories/users.repository';
import { BadRequestError, NotFoundError } from '../types/error.type';
import {
  GetNotificationListRequest,
  GetNotificationRequest,
  ReadNotificationRequest,
} from '../types/notification.type';
import { Payload } from '../types/payload.type';
import { sortToOrderBy } from '../utils/to.util';

export const getNotification = async (user: Payload, request: GetNotificationRequest) => {
  const { params } = request;
  const { id } = params;

  if (!id) {
    throw new BadRequestError();
  }

  const userRef = await getUserReference(user.id);

  const where = {
    id,
    user: userRef,
  };

  const notice = await getNotificationEntity(where);

  return notice;
};

export const getNotificationList = async (user: Payload, request: GetNotificationListRequest) => {
  const { query } = request;
  const { offset, limit, sort } = query;
  const { id } = user;

  console.log('user id', id);

  const where: Record<string, any> = {};

  if (!id) {
    throw new BadRequestError();
  }

  const userRef = await getUserReference(id);
  where.user = userRef;

  const orderBy = sortToOrderBy(sort);

  const options = {
    offset,
    limit,
    orderBy,
  };

  const notificationList = await getNotificationEntityList(where, options);

  const data = {
    totalCount: notificationList[1],
    list: notificationList[0],
  };

  return data;
};

export const getNotificationUnreadList = async (user: Payload, request: GetNotificationListRequest) => {
  const { query } = request;
  const { offset, limit, sort } = query;
  const { id } = user;

  const where: Record<string, any> = {};

  if (!id) {
    throw new BadRequestError();
  }

  const userRef = await getUserReference(id);
  where.user = userRef;

  where.isRead = false;

  const orderBy = sortToOrderBy(sort);

  const options = {
    offset,
    limit,
    orderBy,
  };

  const notificationList = await getNotificationEntityList(where, options);

  const data = {
    totalCount: notificationList[1],
    list: notificationList[0],
  };

  return data;
};

export const updateNotificationRead = async (user: Payload, request: ReadNotificationRequest) => {
  const { params } = request;
  const { id } = params;

  const userRef = await getUserReference(user.id);

  const where = {
    id,
    user: userRef,
  };

  const notice = await getNotificationEntity(where);

  return notice;
};
