import HTTP_STATUSES from '../common/http.status.mjs';
import { errorWithStatus } from '../util/error.util.mjs';
import * as articleDtos from './article.dto.mjs';
import * as articleServices from './article.services.mjs'

export const handleGetArticleList = async (req, res, next) => {
  try {
    const [getError, validatedQuery] = articleDtos.validateGetArticleList(req.query);
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const articleList = await articleServices.getArticleList(validatedQuery, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: articleList
    });
  } catch (error) {
    next(error);
  }
}

export const handleGetArticle = async (req, res, next) => {
  try {
    const [getError, validatedParams] = articleDtos.validateGetArticle({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const article = await articleServices.getArticle(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
}

export const handleCreateArticle = async (req, res, next) => {
  try {
    const [createError, validatedBody] = articleDtos.validateCreateArticle(req.body);
    if (createError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, createError.message);
    }

    const createdArticle = await articleServices.createArticle(validatedBody, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: createdArticle
    });
  } catch (error) {
    next(error);
  }
}

export const handleUpdateArticle = async (req, res, next) => {
  try {
    const [getError, validatedParams] = articleDtos.validateGetArticle({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const [updateError, validatedBody] = articleDtos.validateUpdateArticle(req.body);
    if (updateError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, updateError.message);
    }

    const updatedArticle = await articleServices.updateArticle(validatedParams, validatedBody, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: updatedArticle
    });
  } catch (error) {
    next(error);
  }
}

export const handleDeactivateArticle = async (req, res, next) => {
  try {
    const [getError, validatedParams] = articleDtos.validateDeactivateArticle({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const deactivatedArticle = await articleServices.deactivateArticle(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: deactivatedArticle
    });
  } catch (error) {
    next(error);
  }
}

export const handleActivateArticle = async (req, res, next) => {
  try {
    const [getError, validatedParams] = articleDtos.validateActivateArticle({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const activatedArticle = await articleServices.activateArticle(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: activatedArticle
    });
  } catch (error) {
    next(error);
  }
}

export const handleDeleteArticle = async (req, res, next) => {
  try {
    const [getError, validatedParams] = articleDtos.validateDeleteArticle({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const deletedArticle = await articleServices.deleteArticle(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: deletedArticle
    });
  } catch (error) {
    next(error);
  }
}