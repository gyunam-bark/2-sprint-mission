import prisma from '../prisma/prisma.js';
import { HttpError } from './error-util.js';

export const getExistProduct = async (where) => {
  const existUser = await prisma.product.findUnique({
    where,
  });
  if (!existUser) {
    throw new HttpError(404, '제품을 찾을 수 없습니다.');
  }
  return existUser;
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
