import prisma from './prisma.js';

export const runWithdrawTransaction = async (userId, data, done) => {
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
