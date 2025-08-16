import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { NotificationEntity } from '../entities/notification.entity';
import { getEm } from '../utils/mikro.util';
import { getUserReference } from './users.repository';

export const getNotificationEntityList = async (
  where: FilterQuery<NotificationEntity>,
  options: FindOptions<NotificationEntity>
): Promise<[NotificationEntity[], number]> => {
  const em = await getEm();

  return await em.findAndCount(NotificationEntity, where, options);
};

export const getNotificationEntity = async (where: FilterQuery<NotificationEntity>): Promise<NotificationEntity> => {
  const em = await getEm();

  const notice = await em.findOneOrFail(NotificationEntity, where);

  if (notice.isRead === false) {
    notice.isRead = true;
    notice.readAt = new Date();

    await em.persistAndFlush(notice);
  }

  return notice;
};

export const createNotificationEntity = async (userId: string, message: string): Promise<NotificationEntity> => {
  const em = await getEm();

  const userRef = await getUserReference(userId);

  const notice = new NotificationEntity();
  notice.user = userRef;
  notice.message = message;
  notice.isRead = false;

  await em.persistAndFlush(notice);

  return notice;
};
