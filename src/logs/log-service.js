import prisma from '../prisma/prisma.js';
import { comparePassword } from '../util/crypt-util.js';
import { toOrderBy } from '../util/to-util.js';

export const getLogList = async (query) => {
  const { skip, take, sort, keyword } = query;

  const orderBy = toOrderBy(sort);

  const keywordFilter = keyword
    ? {
        OR: [
          { ip: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
          { method: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
          { message: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
          { url: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
          { statusCode: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
        ],
      }
    : {};

  const where = {
    ...keywordFilter,
  };

  const logList = await prisma.log.findMany({
    skip,
    take,
    orderBy,
    where,
  });

  const totalCount = await prisma.log.count({ where });

  return {
    totalCount: totalCount,
    data: logList,
  };
};

export const deleteLog = async (param, body, master) => {
  const { id } = param;
  const { password } = body;

  const existLog = await prisma.log.findUnique({ where: { id } });

  await comparePassword(password, master.password);

  const deletedLog = await prisma.log.delete({ where: { id: existLog.id } });

  return deletedLog;
};
