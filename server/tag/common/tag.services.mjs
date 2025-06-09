import database from "../../database/prisma.client.mjs";
import * as PRISMA_CONSTANTS from '../../database/prisma.constant.mjs';
import COMMON_STATUSES from "../../common/common.status.mjs";
import COMMON_SORTS from "../../common/common.sort.mjs";
import HTTP_STATUSES from '../../common/http.status.mjs';
import * as permission from "../../util/permission.util.mjs";
import { errorWithStatus } from '../../util/error.util.mjs';
import TAG_TYPES from "./tag.type.mjs";

// SELECT
// MASTER 일 때는 모든 정보를 본다.
const SELECT_MASTER = {
  id: true,
  name: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
};

const SELECT_DELETE = {
  id: true,
  name: true
};

const getSelectTarget = (target) => {
  let option = {};
  switch (target) {
    case TAG_TYPES.PRODUCT: {
      option = {
        products: true
      };
      break;
    };
    case TAG_TYPES.ARTICLE: {
      option = {
        articles: true
      };
      break;
    };
    default: {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, 'not valid comment target');
    };
  }
  return option;
};

const getSelect = (isMaster, target) => {
  const selectTarget = getSelectTarget(target);
  return isMaster
    ? {
      ...SELECT_MASTER,
      ...selectTarget
    }
    : {
      id: true,
      name: true,
      createdAt: true,
    };
};

const getTargetTable = (target) => {
  const name = `${target.toLowerCase()}Tag`;
  return database[name];
};

export const getTagList = async (target, queries = {}, user = {}) => {
  const {
    query,
    sort,
    showInactive,
  } = queries;

  // 오래된 순 : 오름차순(ㅇㄹ 자음이 같음ㅋ)
  const orderBy = sort === COMMON_SORTS.OLDEST
    ? { name: PRISMA_CONSTANTS.ORDER.ORDER_BY_ASCEND }
    : { name: PRISMA_CONSTANTS.ORDER_BY_DESCEND };

  // 해당 유저가 MASTER 인지 확인
  const isMaster = permission.isMaster(user);

  // MASTER 권한일 때만 비활성화 USER 를 볼 수 있다.
  const inactiveFilter = showInactive && isMaster
    ? {}
    : { status: COMMON_STATUSES.ACTIVE };

  // query에 들어간 글자를 name 에서 검색한다.
  const queryFilter = query
    ? {
      name: { contains: query, mode: PRISMA_CONSTANTS.CONTAINS_INSENSITIVE }
    }
    : {};

  const where = {
    ...inactiveFilter,
    ...queryFilter,
  };

  const select = getSelect(isMaster, target);

  const targetTable = getTargetTable(target);

  const tagList = await targetTable.findMany({
    orderBy: orderBy,
    where: where,
    select: select
  });

  const totalCount = await targetTable.count({ where });

  return {
    totalCount: totalCount,
    list: tagList
  };
};

export const getTag = async (target, params = {}, user = {}) => {
  const { id } = params;

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster, target);

  const targetTable = getTargetTable(target);

  const tag = await targetTable.findUnique({
    where: { id: id },
    select: select
  });

  if (!tag) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, "tag not found");
  }

  return tag;
};

export const createTag = async (target, body = {}, user = {}) => {
  const { name } = body;

  const targetTable = getTargetTable(target);

  const existTag = await targetTable.findUnique({
    where: { name: name }
  });

  if (existTag) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_CONFLICT_409, "tag already exists");
  }

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster, target);

  const createdTag = await targetTable.create({
    data: body,
    select: select
  });

  return createdTag;
};

export const updateTag = async (target, params = {}, body = {}, user = {}) => {
  const { id } = params;

  await getTag(target, params, user);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster, target);

  const targetTable = getTargetTable(target);

  const updatedTag = await targetTable.update({
    where: { id: id },
    data: body,
    select: select
  });

  return updatedTag;
};

export const deactivateTag = async (target, params = {}, user = {}) => {
  const { id } = params;

  await getTag(target, params, user);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster, target);

  const targetTable = getTargetTable(target);

  const deactivatedTag = await targetTable.update({
    where: { id: id },
    data: {
      status: COMMON_STATUSES.INACTIVE,
      deletedAt: new Date()
    },
    select: select
  });

  return deactivatedTag;
};

export const activateTag = async (target, params = {}, user = {}) => {
  const { id } = params;

  await getTag(target, params, user);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster, target);

  const targetTable = getTargetTable(target);

  const activatedTag = await targetTable.update({
    where: { id: id },
    data: {
      status: COMMON_STATUSES.ACTIVE,
      deletedAt: null
    },
    select: select
  });

  return activatedTag;
};

export const deleteTag = async (target, params = {}, user = {}) => {
  const { id } = params;

  await getTag(target, params, user);

  const targetTable = getTargetTable(target);

  const deletedTag = await targetTable.delete({
    where: { id: id },
    select: SELECT_DELETE
  });

  return deletedTag;
};