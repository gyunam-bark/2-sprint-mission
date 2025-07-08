import prisma from '../prisma/prisma.js';
import { NotFoundError } from './error-util.js';

export const getExistProductComment = async (where) => {
  const existProductComment = await prisma.productComment.findUnique({
    where,
    include: {
      likes: true,
    },
  });
  if (!existProductComment) {
    throw new NotFoundError();
  }
  return existProductComment;
};

export const getExistArticleComment = async (where) => {
  const existArticleComment = await prisma.articleComment.findUnique({
    where,
  });
  if (!existArticleComment) {
    throw new NotFoundError();
  }
  return existArticleComment;
};
export const toggleProductCommentLike = async (productCommentId, userId) => {
  const existProductCommentLike = await prisma.productCommentLike.findUnique({
    where: {
      userId_productCommentId: {
        userId,
        productCommentId,
      },
    },
  });

  if (existProductCommentLike) {
    const unlikedProductComment = await prisma.productCommentLike.delete({
      where: {
        userId_productCommentId: {
          userId,
          productCommentId,
        },
      },
    });
    return unlikedProductComment;
  } else {
    const likedProductComment = await prisma.productCommentLike.create({
      data: {
        user: { connect: { id: userId } },
        productComment: { connect: { id: productCommentId } },
      },
    });
    return likedProductComment;
  }
};
export const toggleArticleCommentLike = async (articleCommentId, userId) => {
  const existArticleCommentLike = await prisma.articleCommentLike.findUnique({
    where: {
      userId_articleCommentId: {
        userId,
        articleCommentId,
      },
    },
  });

  if (existArticleCommentLike) {
    await prisma.articleCommentLike.delete({
      where: {
        userId_articleCommentId: {
          userId,
          articleCommentId,
        },
      },
    });
    return { isLiked: false };
  } else {
    await prisma.articleCommentLike.create({
      data: {
        user: { connect: { id: userId } },
        articleComment: { connect: { id: articleCommentId } },
      },
    });
    return { isLiked: true };
  }
};
