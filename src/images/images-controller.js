import path, { dirname } from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { BadRequestError } from '../util/error-util.js';
import { getImageFromContext, getParamFromContext } from '../util/from-util.js';
import { deleteImage, uploadImage } from './images-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootPath = path.resolve(__dirname, '../../');

export const handleUploadImage = async (c) => {
  const file = await getImageFromContext(c);

  const isValidFile = file instanceof File;
  if (!isValidFile) {
    throw new BadRequestError();
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extname = path.extname(file.name);
  const basename = path.basename(file.name, extname);
  const filename = `${Date.now()}-${basename}${extname}`;
  const savePath = path.join(rootPath, 'storage', filename);

  await fs.writeFile(savePath, buffer);

  const createdImage = await uploadImage(basename, extname, savePath);

  const response = {
    success: true,
    data: createdImage,
  };

  return c.json(response, 200);
};

export const handleDeleteImage = async (c) => {
  const { id } = await getParamFromContext(c);

  const deletedImage = await deleteImage(id);

  if (deletedImage.url) {
    const filePath = path.resolve(rootPath, deletedImage.url);

    await fs.unlink(filePath);
  }

  const response = {
    success: true,
    data: deletedImage,
  };

  return c.json(response, 200);
};
