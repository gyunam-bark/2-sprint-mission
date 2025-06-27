import prisma from '../prisma/prisma.js';
import { NotFoundError } from './error-util.js';

export const getExistProduct = async (where) => {
  const existProduct = await prisma.product.findUnique({
    where,
  });
  if (!existProduct) {
    throw new NotFoundError();
  }
  return existProduct;
};

export const checkProductTagList = async (tags) => {
  let tagsOption = undefined;
  if (tags) {
    const tagList = await prisma.productTag.findMany({
      where: { id: { in: tags } },
    });

    const foundTagIdList = tagList.map((tag) => tag.id);
    const invalidTagIdList = tags.filter((id) => !foundTagIdList.includes(id));

    if (invalidTagIdList.length > 0) {
      throw new NotFoundError();
    }

    tagsOption = {
      connect: tagList.map((tag) => ({ id: tag.id })),
    };
  }
  return tagsOption;
};

export const toggleProductLike = async (productId, userId) => {
  const existProductLike = await prisma.productLike.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existProductLike) {
    const unlikedProduct = await prisma.productLike.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return unlikedProduct;
  } else {
    const likedProduct = await prisma.productLike.create({
      data: {
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
      },
    });
    return likedProduct;
  }
};
