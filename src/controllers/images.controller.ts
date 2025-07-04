import { RequestHandler } from 'express';
import { deleteImage, getImageList, uploadImage } from '../services/images.service';
import { successResponse } from '../utils/response.util';
import { DeleteImageRequest, GetImageListRequest } from '../types/image.type';
import { getUser } from '../utils/user.util';

export const handleUploadImage: RequestHandler = async (req, res, next) => {
  const data = await uploadImage(req.file);

  res.status(200).json(successResponse(data));
};

export const handleGetImageList: RequestHandler = async (req, res, next) => {
  const data = await getImageList(req.validated as GetImageListRequest);

  res.status(200).json(successResponse(data));
};

export const handleDeleteImage: RequestHandler = async (req, res, next) => {
  const master = getUser(req);
  const data = await deleteImage(master, req.validated as DeleteImageRequest);

  res.status(200).json(successResponse(data));
};
