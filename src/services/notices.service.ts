import { getNoticeEntity } from '../repositories/notice.repository';
import { getUserReference } from '../repositories/users.repository';
import { BadRequestError, NotFoundError } from '../types/error.type';
import { GetNoticeRequest } from '../types/notice.type';
import { Payload } from '../types/payload.type';
export const getNotice = async (user: Payload, request: GetNoticeRequest) => {
  const { params } = request;
  const { id } = params;

  if (!id) {
    throw new BadRequestError();
  }

  const userRef = await getUserReference(id);

  const where = {
    id,
    user: userRef,
  };

  const notice = await getNoticeEntity(where);

  return notice;
};
