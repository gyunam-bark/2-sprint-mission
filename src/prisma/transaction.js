import prisma from './prisma.js';
import { USER_STATUS, COMMON_STATUS } from '../constant/constant.js';

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

export const runDeleteUserTransaction = async (userId, anonymousUserId) => {
  const data = { userId: anonymousUserId };

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
