import HTTP_STATUSES from '../../common/http.status.mjs';
import { errorWithStatus } from '../../util/error.util.mjs';
import * as commentDtos from './comment.dto.mjs';
import * as commentServices from './comment.services.mjs';

const getTargetId = (target, data) => {
  const name = `${target.toLowerCase()}Id`;
  return data[name];
};

export const handleGetCommentList = async (req, res, next, target) => {
  try {
    const targetId = getTargetId(target, req.query);

    const [getError, validatedQuery] =
      commentDtos.validateGetCommentList({
        ...req.query,
        targetId: targetId,
      });

    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const commentList = await commentServices.getCommentList(
      target, validatedQuery, req.user
    );

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: commentList
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetComment = async (req, res, next, target) => {
  try {
    const [getError, validatedParams] =
      commentDtos.validateGetComment({ id: req.params.id });

    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const comment = await commentServices.getComment(
      target, validatedParams, req.user
    );

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
}

export const handleCreateComment = async (req, res, next, target) => {
  try {
    const targetId = getTargetId(target, req.body);
    const content = req.body.content;

    const [createError, validatedBody] =
      commentDtos.validateCreateComment({
        targetId: targetId,
        userId: req.user.id,
        content: content
      });

    if (createError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, createError.message);
    }

    const createdComment = await commentServices.createComment(
      target, validatedBody, req.user
    );

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: createdComment
    });
  } catch (error) {
    next(error);
  }
}

export const handleUpdateComment = async (req, res, next, target) => {
  try {
    // ID 검증
    const [getError, validatedParams] =
      commentDtos.validateGetComment({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const [updateError, validatedBody] =
      commentDtos.validateUpdateComment(req.body);
    if (updateError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, updateError.message);
    }

    const commentProduct = await commentServices.updateComment(
      target, validatedParams, validatedBody, req.user
    );

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: commentProduct
    });
  } catch (error) {
    next(error);
  }
}

export const handleDeactivateComment = async (req, res, next, target) => {
  try {
    const [getError, validatedParams] =
      commentDtos.validateDeactivateComment({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const deactivatedComment = await commentServices.deactivateComment(
      target, validatedParams, req.user
    );

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: deactivatedComment
    });
  } catch (error) {
    next(error);
  }
}

export const handleActivateComment = async (req, res, next, target) => {
  try {
    const [getError, validatedParams] =
      commentDtos.validateActivateComment({ id: req.params.id });

    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const activatedComment = await commentServices.activateComment(
      target, validatedParams, req.user
    );

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: activatedComment
    });
  } catch (error) {
    next(error);
  }
}

export const handleDeleteComment = async (req, res, next, target) => {
  try {
    const [getError, validatedParams] =
      commentDtos.validateDeleteComment({ id: req.params.id });

    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const deletedtComment = await commentServices.deleteComment(
      target, validatedParams, req.user
    );

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: deletedtComment
    });
  } catch (error) {
    next(error);
  }
}