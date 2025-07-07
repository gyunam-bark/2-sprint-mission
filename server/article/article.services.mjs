import database from "../database/prisma.client.mjs";
import COMMON_SORTS from '../common/common.sort.mjs';
import COMMON_STATUSES from "../common/common.status.mjs";
import HTTP_STATUSES from '../common/http.status.mjs';
import * as permission from "../util/permission.util.mjs";
import { errorWithStatus } from '../util/error.util.mjs';
import * as PRISMA_CONSTANTS from '../database/prisma.constant.mjs';

// SELECT
// MASTER 일 때는 모든 정보를 본다.
// USER 는 id, name, email, createdAt 만 본다.
const SELECT_MASTER = {
  id: true,
  title: true,
  content: true,
  user: true,
  status: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  images: true,
  comments: true
};

const SELECT_DELETE = {
  id: true,
  title: true
};

const getSelect = (isMaster) => {
  return isMaster
    ? SELECT_MASTER
    : {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    };
};

export const getArticleList = async (queries = {}, user = {}) => {
  const {
    offset,
    limit,
    sort,
    query,
    showInactive,
  } = queries;

  // 오래된 순 : 오름차순(ㅇㄹ 자음이 같음ㅋ)
  // 최신 순 : 내림차순
  const orderBy = sort === COMMON_SORTS.OLDEST
    ? { createdAt: PRISMA_CONSTANTS.ORDER_BY_ASCEND }
    : { createdAt: PRISMA_CONSTANTS.ORDER_BY_DESCEND };

  // 해당 유저가 MASTER 인지 확인
  const isMaster = permission.isMaster(user);

  // MASTER 권한일 때만 비활성화 ARTICLE 을 볼 수 있다.
  const inactiveFilter = showInactive && isMaster
    ? {}
    : { status: COMMON_STATUSES.ACTIVE };

  // query에 들어간 글자를 title 과 content 에서 검색한다.
  const searchFilter = query
    ? {
      OR: [
        { title: { contains: query, mode: PRISMA_CONSTANTS.CONTAINS_INSENSITIVE } },
        { content: { contains: query, mode: PRISMA_CONSTANTS.CONTAINS_INSENSITIVE } }
      ]
    }
    : {};

  const where = {
    ...inactiveFilter,
    ...searchFilter
  };

  const select = getSelect(isMaster);

  const articleList = await database.article.findMany({
    skip: offset,
    take: limit,
    orderBy: orderBy,
    where: where,
    select: select
  });

  const totalCount = await database.article.count({ where: where });

  return {
    totalCount: totalCount,
    list: articleList
  };
};

export const getArticle = async (params = {}, user = {}) => {
  const { id } = params;

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const article = await database.article.findUnique({
    where: { id: id },
    select: select
  });

  if (!article) {
    throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, 'article not found');
  }

  return article;
};

export const createArticle = async (body = {}, user = {}) => {
  const {
    title, content, tags, images
  } = body;

  // TAG 는 선택사항
  let tagList = [];
  if (tags) {
    tagList = await database.articleTag.findMany({ where: { id: { in: tags } } });

    if (tagList.length !== tags.length) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, 'no valid product tags found');
    }
  }

  // IMAGE 는 선택사항
  let imageList = [];
  if (images) {
    imageList = await database.image.findMany({ where: { id: { in: images } } });
    if (imageList.length !== images.length) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, 'image not found');
    }
  }

  const createdArticle = await database.article.create({
    data: {
      title,
      content,
      user: { connect: { id: user.id } },
      tags: {
        connect: tags.map(id => ({ id }))
      }
    }
  });

  if (imageList.length > 0) {
    await database.articleImageLink.createMany({
      data: imageList.map(image => ({
        articleId: createdArticle.id,
        imageId: image.id
      })),
      skipDuplicates: true
    });
  }

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const createdArticleWithImageList = await database.article.findUnique({
    where: { id: createdArticle.id },
    select: select
  });

  return createdArticleWithImageList;
};

export const updateArticle = async (params = {}, body = {}, user = {}) => {
  const { id } = params;
  const { tags, images } = body;

  await getArticle(params, user);

  // TAG 는 선택사항
  if (tags) {
    const tagList = await database.articleTag.findMany({ where: { id: { in: tags } } });
    if (tagList.length !== tags.length) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, 'no valid article tags found');
    }
    data.tags = { set: tags.map(id => ({ id })) };
  }

  const updatedArticle = await database.article.update({
    where: { id },
    data: body,
    include: { tags: true }
  });

  if (images) {
    const imageList = await database.image.findMany({ where: { id: { in: images } } });
    if (imageList.length !== images.length) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_NOT_FOUND_404, 'some image(s) not found');
    }

    await database.articleImageLink.deleteMany({ where: { articleId: id } });
    await database.articleImageLink.createMany({
      data: imageList.map(image => ({
        articleId: id,
        imageId: image.id
      })),
      skipDuplicates: true
    });
  }

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const updatedArticleImageLinked = await database.article.findUnique({
    where: { id: updatedArticle.id },
    select: select
  });

  return updatedArticleImageLinked;
};

export const deactivateArticle = async (params = {}, user = {}) => {
  const { id } = params;

  await getArticle(params, user);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const deactivatedArticle = await database.article.update({
    where: { id: id },
    data: {
      status: COMMON_STATUSES.INACTIVE,
      deletedAt: new Date()
    },
    select: select
  });

  return deactivatedArticle;
};

export const activateArticle = async (params = {}, user = {}) => {
  const { id } = params;

  await getArticle(params, user);

  const isMaster = permission.isMaster(user);
  const select = getSelect(isMaster);

  const activatedArticle = await database.article.update({
    where: { id: id },
    data: {
      status: COMMON_STATUSES.ACTIVE,
      deletedAt: null
    },
    select: select
  });

  return activatedArticle;
};

export const deleteArticle = async (params = {}, user = {}) => {
  const { id } = params;

  await getArticle(params, user);

  const deletedArticle = await database.article.delete({
    where: { id: id },
    select: SELECT_DELETE
  });

  return deletedArticle;
};