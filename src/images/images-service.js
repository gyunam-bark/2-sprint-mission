import prisma from '../prisma/prisma.js';
import { HttpError } from '../util/error-util.js';

export const uploadImage = async (name, ext, path) => {
  try {
    const createdImage = await prisma.image.create({
      data: {
        name,
        ext,
        url: path,
      },
    });

    return createdImage;
  } catch (error) {
    throw error;
  }
};

export const deleteImage = async (id) => {
  try {
    const existImage = await prisma.image.findUnique({ where: { id } });
    if (!existImage) {
      throw new HttpError(400, '해당 이미지가 없습니다.');
    }

    await prisma.image.delete({ where: { id: existImage.id } });

    return existImage;
  } catch (error) {
    throw error;
  }
};
