import prisma from '../prisma/prisma.js';
import { HttpError } from './error-util.js';

export const getExistProduct = async (where) => {
  const existProduct = await prisma.product.findUnique({
    where,
  });
  if (!existProduct) {
    throw new HttpError(404, '제품을 찾을 수 없습니다.');
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
      throw new HttpError(400, `유효하지 않은 태그가 입력되었습니다.`);
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
