import * as tagDtos from './tag.dto.mjs';
import * as tagServices from './tag.services.mjs';
import { errorWithStatus } from '../../util/error.util.mjs';
import HTTP_STATUSES from '../../common/http.status.mjs';

export const handleGetTagList = async (req, res, next, target) => {
  try {
    const [getError, validatedQuery] = tagDtos.validateGetTagList(req.query);
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const tagList = await tagServices.getTagList(target, validatedQuery, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: tagList
    });
  }
  catch (error) {
    next(error);
  }
};

export const handleGetTag = async (req, res, next, target) => {
  try {
    const [getError, validatedParams] = tagDtos.validateGetTag({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const tag = await tagServices.getTag(target, validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: tag
    });
  }
  catch (error) {
    next(error);
  }
};

export const handleCreateTag = async (req, res, next, target) => {
  try {
    const [createError, validatedBody] = tagDtos.validateCreateTag(req.body);
    if (createError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, createError.message);
    }

    const createdTag = await tagServices.createTag(target, validatedBody, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: createdTag
    });
  }
  catch (error) {
    next(error);
  }
};


export const handleUpdateTag = async (req, res, next, target) => {
  try {
    const [getError, validatedParams] = tagDtos.validateGetTag({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const [updateError, validatedBody] = tagDtos.validateUpdateTag(req.body);
    if (updateError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, updateError.message);
    }

    const updatedTag = await tagServices.updateTag(target, validatedParams, validatedBody, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: updatedTag
    });
  }
  catch (error) {
    next(error);
  }
};


export const handleDeactivateTag = async (req, res, next, target) => {
  try {
    const [deactivateError, validatedParams] = tagDtos.validateDeactivateTag({ id: req.params.id });
    if (deactivateError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, deactivateError.message);
    }

    const deactivatedTag = await tagServices.deactivateTag(target, validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: deactivatedTag
    });
  }
  catch (error) {
    next(error);
  }
};

export const handleActivateTag = async (req, res, next, target) => {
  try {
    const [activateError, validatedParams] = tagDtos.validateActivateTag({ id: req.params.id });
    if (activateError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, activateError.message);
    }

    const activatedTag = await tagServices.activateTag(target, validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: activatedTag
    });
  }
  catch (error) {
    next(error);
  }
};

export const handleDeleteTag = async (req, res, next, target) => {
  try {
    const [deleteError, validatedParams] = tagDtos.validateDeleteTag({ id: req.params.id });
    if (deleteError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, deleteError.message);
    }

    const deletedTag = await tagServices.deleteTag(target, validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: deletedTag
    });
  }
  catch (error) {
    next(error);
  }
};