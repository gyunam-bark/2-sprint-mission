import path, { dirname } from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { HttpError } from '../util/error-util.js';
import { getImageFromContext } from '../util/from-util.js';
import { uploadImage } from './images-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootPath = path.resolve(__dirname, '../../');

export const handleUploadImage = async (c) => {
  try {
    const file = await getImageFromContext(c);

    const isValidFile = file instanceof File;
    if (!isValidFile) {
      throw new HttpError(400, '파일이 업로드 되지 않았습니다.');
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
  } catch (error) {
    throw error;
  }
};
