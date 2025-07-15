import prisma from './prisma.js';
import { USER_STATUS, COMMON_STATUS } from '../constant/constant.js';
import { getArchivedUser } from '../util/user-util.js';

export const runWithdrawTransaction = async (userId) => {
  const data = { status: USER_STATUS.INACTIVE, deletedAt: new Date() };

  return await prisma.$transaction([
    prisma.product.updateMany({
      where: { userId },
      data,
    }),
    prisma.article.updateMany({
      where: { userId },
      data,
    }),
    prisma.productComment.updateMany({
      where: { userId },
      data: data,
    }),
    prisma.articleComment.updateMany({
      where: { userId },
      data: data,
    }),
    prisma.user.update({
      where: { id: userId },
      data: data,
    }),
  ]);
};

export const runDeleteUserTransaction = async (userId) => {
  const archivedUser = await getArchivedUser();
  const data = { userId: archivedUser.id };

  return await prisma.$transaction([
    prisma.product.updateMany({
      where: { userId },
      data,
    }),
    prisma.article.updateMany({
      where: { userId },
      data,
    }),
    prisma.productComment.updateMany({
      where: { userId },
      data: data,
    }),
    prisma.articleComment.updateMany({
      where: { userId },
      data: data,
    }),
    prisma.user.delete({
      where: { id: userId },
    }),
  ]);
};

export const runActivateUserTransaction = async (userId) => {
  const data = { status: COMMON_STATUS.ACTIVE };

  return await prisma.$transaction([
    prisma.product.updateMany({
      where: { userId },
      data,
    }),
    prisma.article.updateMany({
      where: { userId },
      data,
    }),
    prisma.productComment.updateMany({
      where: { userId },
      data: data,
    }),
    prisma.articleComment.updateMany({
      where: { userId },
      data: data,
    }),
    prisma.user.update({
      where: { id: userId },
      data: data,
    }),
  ]);
};

export const runDeactivateUserTransaction = async (userId) => {
  const data = { status: COMMON_STATUS.INACTIVE };

  return await prisma.$transaction([
    prisma.product.updateMany({
      where: { userId },
      data,
    }),
    prisma.article.updateMany({
      where: { userId },
      data,
    }),
    prisma.productComment.updateMany({
      where: { userId },
      data: data,
    }),
    prisma.articleComment.updateMany({
      where: { userId },
      data: data,
    }),
    prisma.user.update({
      where: { id: userId },
      data: data,
    }),
  ]);
};

export const runDectivateProductTransaction = async (productId) => {
  const data = { status: COMMON_STATUS.INACTIVE };

  return await prisma.$transaction([
    prisma.productComment.updateMany({
      where: { productId },
      data: data,
    }),
    prisma.product.update({
      where: { id: productId },
      data: data,
    }),
  ]);
};

export const runActivateProductTransaction = async (productId) => {
  const data = { status: COMMON_STATUS.ACTIVE };

  return await prisma.$transaction([
    prisma.productComment.updateMany({
      where: { productId },
      data: data,
    }),
    prisma.product.update({
      where: { id: productId },
      data: data,
    }),
  ]);
};

export const runDeleteProductTransaction = async (productId) => {
  const archivedUser = await getArchivedUser();
  const data = { userId: archivedUser.id };

  return await prisma.$transaction([
    prisma.productComment.updateMany({
      where: { productId },
      data: data,
    }),
    prisma.product.delete({
      where: { id: productId },
    }),
  ]);
};

export const runDectivateArticleTransaction = async (articleId) => {
  const data = { status: COMMON_STATUS.INACTIVE };

  return await prisma.$transaction([
    prisma.articleComment.updateMany({
      where: { articleId },
      data: data,
    }),
    prisma.article.update({
      where: { id: articleId },
      data: data,
    }),
  ]);
};

export const runActivateArticleTransaction = async (articleId) => {
  const data = { status: COMMON_STATUS.ACTIVE };

  return await prisma.$transaction([
    prisma.articleComment.updateMany({
      where: { articleId },
      data: data,
    }),
    prisma.article.update({
      where: { id: articleId },
      data: data,
    }),
  ]);
};

export const runDeleteArticleTransaction = async (articleId) => {
  const archivedUser = await getArchivedUser();
  const data = { userId: archivedUser.id };

  return await prisma.$transaction([
    prisma.productComment.updateMany({
      where: { articleId },
      data: data,
    }),
    prisma.product.delete({
      where: { id: articleId },
    }),
  ]);
};
