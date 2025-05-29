import HTTP_STATUSES from '../common/http.status.mjs';
import { errorWithStatus } from '../util/error.util.mjs';
import * as imageDtos from './image.dto.mjs'
import * as imageServices from './image.services.mjs';

export const handleCreateImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, 'no file uploaded');
    }

    const name = req.file.originalname;
    const ext = req.file.ext.substring(1);
    const url = `/storage/${req.file.filename}`;

    const [getError, validatedBody] = imageDtos.validateCreateImage({
      name: name,
      ext: ext,
      url: url
    });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const createdImage = await imageServices.createImage(validatedBody, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: createdImage
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetImageList = async (req, res, next) => {
  try {
    const [getError, validatedQuery] = imageDtos.validateGetImageList(req.query);
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const imageList = await imageServices.getImageList(validatedQuery, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: imageList
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetImage = async (req, res, next) => {
  try {
    const [getError, validatedParams] = imageDtos.validateGetImage({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const image = await imageServices.getImage(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: image
    });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteImage = async (req, res, next) => {
  try {
    const [getError, validatedParams] = imageDtos.validateDeleteImage({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const image = await imageServices.deleteImage(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: image
    });
  } catch (error) {
    next(error);
  }
};

export const handleDownloadImage = async (req, res, next) => {
  try {
    const [getError, validatedParams] = imageDtos.validateDownloadImage({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const image = await imageServices.downloadImage(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).download(image.url, image.name);
  } catch (error) {
    next(error);
  }
};