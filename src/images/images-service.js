import prisma from '../prisma/prisma.js';
import { BadRequestError } from '../util/error-util.js';

export const uploadImage = async (name, ext, path) => {
  const createdImage = await prisma.image.create({
    data: {
      name,
      ext,
      url: path,
    },
  });

  return createdImage;
};

export const deleteImage = async (id) => {
  const existImage = await prisma.image.findUnique({ where: { id } });
  if (!existImage) {
    throw new BadRequestError();
  }

  await prisma.image.delete({ where: { id: existImage.id } });

  return existImage;
};
