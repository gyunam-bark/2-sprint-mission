import prisma from '../prisma/prisma.js';
import { HttpError } from './error-util.js';

export const getExistArticle = async (where) => {
  const existArticle = await prisma.article.findUnique({
    where,
  });
  if (!existArticle) {
    throw new HttpError(404, '게시글을 찾을 수 없습니다.');
  }
  return existArticle;
};

export const checkArticleTagList = async (tags) => {
  let tagsOption = undefined;
  if (tags) {
    const tagList = await prisma.articleTag.findMany({
      where: { id: { in: tags } },
    });

    const foundTagIdList = tagList.map((tag) => tag.id);
    const invalidTagIdList = tags.filter((id) => !foundTagIdList.includes(id));

    if (invalidTagIdList.length > 0) {
      throw new HttpError(400, `유효하지 않은 태그가 입력되었습니다.`);
    }

    tagsOption = {
      connect: tagList.map((tag) => ({ id: tag.id })),
    };
  }
  return tagsOption;
};

export const toggleArticleLike = async (articleId, userId) => {
  const existArticleLike = await prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  if (existArticleLike) {
    const unlikedArticle = await prisma.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
    return unlikedArticle;
  } else {
    const likedArticle = await prisma.articleLike.create({
      data: {
        user: { connect: { id: userId } },
        article: { connect: { id: articleId } },
      },
    });
    return likedArticle;
  }
};
