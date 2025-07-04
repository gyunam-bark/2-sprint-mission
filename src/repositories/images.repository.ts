import path from 'path';
import { ImageEntity } from '../entities/image.entity';
import { DeleteImageRequest, ImageParams, ImageQuery, UploadImageFile } from '../types/image.type';
import { getEm } from '../utils/mikro.util';
import { sortToOrderBy } from '../utils/to.util';
import { Payload } from '../types/payload.type';
import { UserEntity } from '../entities/user.entity';
import { comparePassword } from '../utils/password.util';
import { UnauthorizedError } from '../types/error.type';

export const createImageEntity = async (file: UploadImageFile): Promise<ImageEntity> => {
  const em = await getEm();

  const filename = file.filename;
  const extname = path.extname(filename);
  const url = file.path;

  const image = new ImageEntity();
  image.name = filename;
  image.ext = extname;
  image.url = url;

  await em.persistAndFlush(image);

  return image;
};

export const getImageEntityList = async (query: ImageQuery): Promise<[ImageEntity[], number]> => {
  const { offset, limit, sort, keyword } = query;
  const em = await getEm();

  const where: Record<string, any> = {};

  if (keyword) {
    where.name = { $like: `${keyword}` };
    where.ext = { $like: `${keyword}` };
  }

  const orderBy = sortToOrderBy(sort);

  const options = {
    offset,
    limit,
    orderBy,
  };

  return await em.findAndCount(ImageEntity, where, options);
};

export const deleteImageEntity = async (master: Payload, request: DeleteImageRequest): Promise<void> => {
  const { params, body } = request;
  const { password } = body;

  const em = await getEm();

  const masterUser = await em.findOneOrFail(UserEntity, master.id);
  const isValidPassword = await comparePassword(password, masterUser.password);
  if (!isValidPassword) {
    throw new UnauthorizedError();
  }

  const image = await em.findOneOrFail(ImageEntity, params);
};

export const getImageReference = async (id: string): Promise<ImageEntity> => {
  const em = await getEm();

  return em.getReference(ImageEntity, id);
};
