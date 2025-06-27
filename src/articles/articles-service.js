import { COMMON_STATUS, PRISMA_OPTION } from '../constant/constant.js';
import prisma from '../prisma/prisma.js';
import {
  runActivateArticleTransaction,
  runDectivateArticleTransaction,
  runDeleteArticleTransaction,
} from '../prisma/transaction.js';
import { checkArticleTagList, getExistArticle, toggleArticleLike } from '../util/article-util.js';
import { NotFoundError, UnauthorizedError } from '../util/error-util.js';
import { checkImageList } from '../util/image-util.js';
import { toOrderBy } from '../util/to-util.js';
import { isUserMaster, isUserOwner } from '../util/user-util.js';
import { ARTICLES_SELECT_MASTER, ARTICLES_SELECT_OWNER, ARTICLES_SELECT_USER } from './articles-select.js';

export const createArticle = async (body, user) => {
  const id = user.id;
  const { title, content, tags, images } = body;

  const tagsOption = await checkArticleTagList(tags);
  const imagesOption = await checkImageList(images);

  const createdArticle = await prisma.article.create({
    data: {
      title,
      content,
      user: {
        connect: { id },
      },
      tags: tagsOption,
      images: imagesOption,
    },
  });

  return createdArticle;
};

export const getArticleList = async (query, user) => {
  const id = user.id;
  const { skip, take, sort, keyword, isLiked } = query;

  const orderBy = toOrderBy(sort);

  const keywordFilter = keyword
    ? {
        userId: id,
        OR: [
          { title: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
          { content: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } },
        ],
      }
    : {};

  const isLikedFilter = isLiked
    ? {
        likes: {
          some: {
            userId: id,
          },
        },
      }
    : {};

  const where = {
    ...keywordFilter,
    ...isLikedFilter,
  };

  const include = {
    likes: {
      where: {
        userId: id,
      },
    },
  };

  const articleList = await prisma.article.findMany({
    skip,
    take,
    orderBy,
    where,
    include,
  });

  const articleListAddIsLiked = articleList.map(({ likes, ...rest }) => ({
    ...rest,
    isLiked: likes.length > 0,
  }));

  const totalCount = await prisma.article.count({ where });

  return {
    totalCount: totalCount,
    data: articleListAddIsLiked,
  };
};

export const getArticleDetail = async (param, user) => {
  const { id } = param;

  const existArticle = await getExistArticle({ id });

  if (existArticle.status === COMMON_STATUS.INACTIVE) {
    throw new NotFoundError();
  }

  const queryOptions = {
    where: { id },
  };

  if (isUserMaster(user)) {
    queryOptions.select = ARTICLES_SELECT_MASTER;
  } else if (isUserOwner(user.id, existArticle.id)) {
    queryOptions.select = ARTICLES_SELECT_OWNER;
  } else {
    queryOptions.select = ARTICLES_SELECT_USER;
  }

  const articleDetail = await prisma.article.findUnique(queryOptions);

  return articleDetail;
};

export const updateArticle = async (param, body, user) => {
  const { id } = param;
  const { title, content, tags, images } = body;

  const existArticle = await getExistArticle({ id });

  const tagsOption = await checkArticleTagList(tags);
  const imagesOption = await checkImageList(images);

  if (!isUserMaster(user) && !isUserOwner(user.id, existArticle.id)) {
    throw new UnauthorizedError();
  }

  const updatedArticle = await prisma.article.update({
    where: { id: existProduct.id },
    data: {
      title,
      content,
      tags: tagsOption,
      images: imagesOption,
    },
  });

  return updatedArticle;
};

export const deactivateArticle = async (param, user) => {
  const { id } = param;

  const existArticle = await getExistArticle({ id });

  if (!isUserMaster(user) && !isUserOwner(user.id, existArticle.id)) {
    throw new UnauthorizedError();
  }

  const results = await runDectivateArticleTransaction(existArticle.id);

  const deactivatedArticle = results.pop();

  return deactivatedArticle;
};

export const activateArticle = async (param) => {
  const { id } = param;

  const existArticle = await getExistArticle({ id });

  if (!isUserMaster(user) && !isUserOwner(user.id, existArticle.id)) {
    throw new UnauthorizedError();
  }

  const results = await runActivateArticleTransaction(existArticle.id);

  const activatedArticle = results.pop();

  return activatedArticle;
};

export const deleteArticle = async (param, body, master) => {
  const { id } = param;
  const { password } = body;

  const existArticle = await getExistArticle({ id });

  await comparePassword(password, master.password);

  const results = await runDeleteArticleTransaction(existArticle.id);

  const deletedArticle = results.pop();

  return deletedArticle;
};

export const likeArticle = async (param, user) => {
  const { id } = param;

  const existArticle = await getExistArticle({ id });

  const likedArticle = await toggleArticleLike(existArticle.id, user.id);

  return likedArticle;
};

export const getArticleCommentList = async (param, query, user) => {
  const { id } = param;
  const { skip, take, sort, keyword, isLiked } = query;

  const existArticle = await getExistArticle({ id });

  const orderBy = toOrderBy(sort);

  const keywordFilter = keyword
    ? {
        articleId: existArticle.id,
        OR: [{ comment: { contains: keyword, mode: PRISMA_OPTION.INSENSITIVE } }],
      }
    : {};

  const isLikedFilter = isLiked
    ? {
        likes: {
          some: {
            userId: user.id,
          },
        },
      }
    : {};

  const where = {
    ...keywordFilter,
    ...isLikedFilter,
  };

  const include = {
    likes: {
      where: {
        userId: id,
      },
    },
  };

  const articleCommentList = await prisma.articleComment.findMany({
    skip,
    take,
    orderBy,
    where,
    include,
  });

  const articleCommentListAddIsLiked = articleCommentList.map(({ likes, ...rest }) => ({
    ...rest,
    isLiked: likes.length > 0,
  }));

  const totalCount = await prisma.articleComment.count({ where });

  return {
    totalCount: totalCount,
    data: articleCommentListAddIsLiked,
  };
};

export const createArticleComment = async (param, body, user) => {
  const { id } = param;
  const { content } = body;

  const existArticle = await getExistArticle({ id });

  const createdArticleComment = await prisma.articleComment.create({
    data: {
      content,
      user: {
        connect: { id: user.id },
      },
      article: {
        connect: { id: existArticle.id },
      },
    },
  });

  return createdArticleComment;
};
