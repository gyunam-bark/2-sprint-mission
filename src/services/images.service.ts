import { createImageEntity, deleteImageEntity, getImageEntityList } from '../repositories/images.repository';
import { BadRequestError } from '../types/error.type';
import { DeleteImageRequest, GetImageListRequest, UploadImageFile } from '../types/image.type';
import { Payload } from '../types/payload.type';

export const uploadImage = async (image: UploadImageFile | undefined) => {
  if (image === undefined) {
    throw new BadRequestError();
  }

  const data = await createImageEntity(image);

  return data;
};

export const getImageList = async ({ query }: GetImageListRequest) => {
  const imageList = await getImageEntityList(query);

  const data = {
    totalCount: imageList[1],
    list: imageList[0],
  };

  return data;
};

export const deleteImage = async (master: Payload, request: DeleteImageRequest) => {
  const data = await deleteImageEntity(master, request);

  return data;
};
