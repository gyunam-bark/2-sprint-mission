import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { NoticeEntity } from '../entities/notice.entity';
import { getEm } from '../utils/mikro.util';
import { getUserReference } from './users.repository';

export const getNoticeEntityList = async (
  where: FilterQuery<NoticeEntity>,
  options: FindOptions<NoticeEntity>
): Promise<[NoticeEntity[], number]> => {
  const em = await getEm();

  return await em.findAndCount(NoticeEntity, where, options);
};

export const getNoticeEntity = async (where: FilterQuery<NoticeEntity>): Promise<NoticeEntity> => {
  const em = await getEm();

  const notice = await em.findOneOrFail(NoticeEntity, where);

  if (notice.isRead === false) {
    notice.isRead = true;
    notice.readAt = new Date();

    await em.persistAndFlush(notice);
  }

  return notice;
};

export const createNotice = async (userId: string, message: string): Promise<NoticeEntity> => {
  const em = await getEm();

  const userRef = await getUserReference(userId);

  const notice = new NoticeEntity();
  notice.user = userRef;
  notice.message = message;
  notice.isRead = false;

  await em.persistAndFlush(notice);

  return notice;
};
