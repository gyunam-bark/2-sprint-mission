import database from "../../database/prisma.client.mjs";
import * as PRISMA_CONSTANTS from '../../database/prisma.constant.mjs';
import COMMON_STATUSES from "../../common/common.status.mjs";
import COMMON_SORTS from "../../common/common.sort.mjs";
import COMMENT_TYPES from "./comment.type.mjs";
import HTTP_STATUSES from '../../common/http.status.mjs';
import * as permission from "../../util/permission.util.mjs";
import { errorWithStatus } from '../../util/error.util.mjs';
import COMMENT_DIRECTIONS from './comment.direction.mjs';

// SELECT
// MASTER 일 때는 모든 정보를 본다.
const SELECT_MASTER = {
  id: true,
  content: true,
  user: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true
};

const SELECT_DELETE = {
  id: true,
  content: true
};

const getSelectTarget = (target) => {
  let option = {};
  switch (target) {
    case COMMENT_TYPES.PRODUCT: {
      option = {
        product: true
      };
      break;
    };
    case COMMENT_TYPES.ARTICLE: {
      option = {
        article: true
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
      content: true,
      createdAt: true,
    };
};

const getTargetFilter = (target, queries) => {
  const targetId = queries.targetId;
  let option = {};
  switch (target) {
    case COMMENT_TYPES.PRODUCT: {
      option = {
        productId: targetId
      };
      break;
    };
    case COMMENT_TYPES.ARTICLE: {
      option = {
        articleId: targetId
      };
      break;
    };
    default: {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, 'not valid comment target');
    };
  };

  return option;
};

const getTargetOption = (target, data) => {
  const targetId = data.targetId;
  let option = {};
  switch (target) {
    case COMMENT_TYPES.PRODUCT: {
      option = {
        product: { connect: { id: targetId } }
      };
      break;
    };
    case COMMENT_TYPES.ARTICLE: {
      option = {
        article: { connect: { id: targetId } }
      };
      break;
    };
    default: {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, 'not valid comment target');
    };
  };

  return option;
};

const getTargetTable = (target) => {
  const name = `${target.toLowerCase()}Comment`;
  return database[name];
};

export const getCommentList = async (target, queries = {}, user = {}) => {
  const {
    cursor, take, sort, direction, query, showInactive
  } = queries;

  // PRISMA CURSOR 방식
  // PREV 이면 앞의 TAKE 수 만큼 asc 로 가져온다.
  // NEXT 이면 뒤의 TAKE 수 만큼 desc 로 가져온다.
  // orderBy 가 정렬에 쓰이는 게 아님!
  const orderBy = direction === COMMENT_DIRECTIONS.PREV
    ? { createdAt: PRISMA_CONSTANTS.ORDER_BY_ASCEND }
    : { createdAt: PRISMA_CONSTANTS.ORDER_BY_DESCEND };

  // 해당 유저가 MASTER 인지 확인
  const isMaster = permission.isMaster(user);

  // MASTER 권한일 때만 비활성화 PRODUCT 를 볼 수 있다.
  const inactiveFilter = showInactive && isMaster
    ? {}
    : { status: COMMON_STATUSES.ACTIVE };

  // query에 들어간 글자를 content 에서 검색한다.
  const queryFilter = query
    ? {
      content: { contains: query, mode: PRISMA_CONSTANTS.CONTAINS_INSENSITIVE }
    }
    : {};

  // targetId 에 소속된 content 를 검색한다.
  // 정확히 일치해야 함!
  const targetFilter = getTargetFilter(target, queries);

  const where = {
    ...inactiveFilter,
    ...queryFilter,
    ...targetFilter
  };

  const select = getSelect(isMaster, target);

  const cursorOptions = cursor
    ? { cursor: { id: cursor }, skip: 1 }
    : {};

  const targetTable = getTargetTable(target);

  const commentList = await targetTable.findMany({
    orderBy: orderBy,
    where: where,
    take: take,
    select: select,
    ...cursorOptions
  });

  // 정렬
  // 받아온 정보를 다시 정렬하고 싶을 때 SORT 로 정렬
  if (sort === COMMON_SORTS.OLDEST) {
    // 오래된 순
    commentList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else {
    // 최신 순
    commentList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const totalCount = await targetTable.count({ where: where });

  return {
    totalCount: totalCount,
    list: commentList
  };
};

export const getComment = async (target, params = {}, user = {}) => {
  const { id } = params;

  const targetTable = getTargetTable(target);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster, target);

  const comment = await targetTable.findUnique({
    where: { id: id },
    select: select
  });

  if (!comment) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, `${target} comment not found`);
  }

  return comment;
};

export const createComment = async (target, body = {}, user = {}) => {
  const { content } = body;

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster, target);

  const userOption = { user: { connect: { id: user.id } } };
  const targetOption = getTargetOption(target, body);

  const targetTable = getTargetTable(target);

  const createdComment = await targetTable.create({
    data: {
      content: content,
      ...userOption,
      ...targetOption
    },
    select: select
  });

  return createdComment;
}

export const updateComment = async (target, params = {}, body = {}, user = {}) => {
  const { id } = params;

  await getComment(target, params, user);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster, target);

  const targetTable = getTargetTable(target);

  const updatedComment = await targetTable.update({
    where: { id },
    data: body,
    select: select
  });

  return updatedComment;
};

export const deactivateComment = async (target, params = {}, user = {}) => {
  const { id } = params;

  await getComment(target, params, user);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster, target);

  const targetTable = getTargetTable(target);

  const deactivatedComment = await targetTable.update({
    where: { id },
    data: {
      status: COMMON_STATUSES.INACTIVE,
      deletedAt: new Date()
    },
    select: select
  });

  return deactivatedComment;
};

export const activateComment = async (target, params = {}, user = {}) => {
  const { id } = params;

  await getComment(target, params, user);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster, target);

  const targetTable = getTargetTable(target);

  const activatedComment = await targetTable.update({
    where: { id },
    data: {
      status: COMMON_STATUSES.ACTIVE,
      deletedAt: null
    },
    select: select
  });

  return activatedComment;
};

export const deleteComment = async (target, params = {}, user = {}) => {
  const { id } = params;

  await getComment(target, params, user);

  const targetTable = getTargetTable(target);

  const deletedComment = await targetTable.delete({
    where: { id: id },
    select: SELECT_DELETE
  });

  return deletedComment;
};