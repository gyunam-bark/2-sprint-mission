import prisma from '../prisma/prisma.js';

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
