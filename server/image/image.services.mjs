import database from '../database/prisma.client.mjs';
import * as PRISMA_CONSTANTS from '../database/prisma.constant.mjs';
import COMMON_SORTS from '../common/common.sort.mjs';
import HTTP_STATUSES from '../common/http.status.mjs';
import * as permission from "../util/permission.util.mjs";
import { errorWithStatus } from '../util/error.util.mjs';
import { getStorageUrl } from '../upload/upload.mjs';

// SELECT
// MASTER 일 때는 모든 정보를 본다.
const SELECT_MASTER = {
  id: true,
  name: true,
  url: true,
  ext: true,
  createdAt: true,
  productImages: true,
  articleImages: true
};

const SELECT_DELETE = {
  id: true,
  url: true
};

const getSelect = (isMaster) => {
  return isMaster
    ? SELECT_MASTER
    : {
      id: true,
      name: true,
      url: true,
      ext: true,
      createdAt: true
    };
};

export const getImageList = async (queries = {}, user = {}) => {
  const {
    offset, limit, sort, query
  } = queries;

  const orderBy = sort === COMMON_SORTS.OLDEST
    ? { createdAt: PRISMA_CONSTANTS.ORDER_BY_ASCEND }
    : { createdAt: PRISMA_CONSTANTS.ORDER_BY_DESCEND };

  const queryFilter = query
    ?
    {
      OR: [
        { name: { contains: query, mode: PRISMA_CONSTANTS.CONTAINS_INSENSITIVE } },
        { ext: { contains: query, mode: PRISMA_CONSTANTS.CONTAINS_INSENSITIVE } }
      ]
    }
    : {};

  const where = {
    ...queryFilter
  };

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const imageList = await database.image.findMany({
    skip: offset,
    take: limit,
    orderBy: orderBy,
    where: where,
    select: select
  });

  const totalCount = await database.image.count({ where });

  return {
    total: totalCount,
    list: imageList
  };
};

export const getImage = async (params = {}, user = {}) => {
  const { id } = params;

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const image = await database.image.findUnique({
    where: { id: id },
    select: select
  });

  if (!image) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, 'image not found');
  }

  return image;
};

export const createImage = async (body = {}, user = {}) => {
  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const createdImage = await database.image.create({
    data: body,
    select: select
  });

  return createdImage;
};

export const deleteImage = async (params = {}, user = {}) => {
  const { id } = params;

  await getImage(params, user);

  const deletedImage = await database.image.delete({
    where: { id: id },
    select: SELECT_DELETE
  });

  return deletedImage;
};

export const downloadImage = async (params = {}, user = {}) => {
  const { id } = params;

  const image = await getImage(params, user);

  const url = getStorageUrl(image.url);
  const name = image.name;

  return {
    url: url,
    name: name
  };
};