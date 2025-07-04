import { getLogEntityList } from '../repositories/log.repository';
import { DeleteLogRequest, GetLogListRequest } from '../types/log.type';
import { Payload } from '../types/payload.type';
import { sortToOrderBy } from '../utils/to.util';

export const getLogList = async (request: GetLogListRequest) => {
  const { query } = request;
  const { offset, limit, sort, keyword } = query;

  const where: Record<string, any> = {};

  if (keyword) {
    const query = { $like: `%${keyword}%` };
    where.$or = [{ ip: query }, { url: query }, { method: query }, { statusCode: query }, { message: query }];
  }

  const orderBy = sortToOrderBy(sort);

  const options = {
    offset,
    limit,
    orderBy,
  };

  const logtList = await getLogEntityList(where, options);

  const data = {
    totalCount: logtList[1],
    list: logtList[0],
  };

  return data;
};

export const deleteLog = async (master: Payload, request: DeleteLogRequest) => {
  const { params } = request;
};
