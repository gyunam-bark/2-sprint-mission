import HTTP_STATUSES from '../common/http.status.mjs';
import { errorWithStatus } from '../util/error.util.mjs';
import * as userDtos from "./user.dto.mjs";
import * as userServices from "./user.services.mjs";

// GET /USERS
export const handleGetUserList = async (req, res, next) => {
  try {
    const [getError, validatedQuery] = userDtos.validateGetUserList(req.query);
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const userList = await userServices.getUserList(validatedQuery, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: userList
    });
  } catch (error) {
    next(error);
  }
};

// GET /USERS/:ID
export const handleGetUser = async (req, res, next) => {
  try {
    const [getError, validatedParams] = userDtos.validateGetUser({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const user = await userServices.getUser(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// POST /USERS
export const handleCreateUser = async (req, res, next) => {
  try {
    const [createError, validatedBody] = userDtos.validateCreateUser(req.body);
    if (createError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, createError.message);
    }

    const createdUser = await userServices.createUser(validatedBody, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: createdUser
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /USERS/:ID
export const handleUpdateUser = async (req, res, next) => {
  try {
    const [getError, validatedParams] = userDtos.validateGetUser({ id: req.params.id });
    if (getError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, getError.message);
    }

    const [updateError, validatedBody] = userDtos.validateUpdateUser(req.body);
    if (updateError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, updateError.message);
    }

    const updatedUser = await userServices.updateUser(
      validatedParams,
      validatedBody,
      req.user
    );

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /USERS/DEACTIVATE/:ID
export const handleDeactivateUser = async (req, res, next) => {
  try {
    const [deactivateError, validatedParams] = userDtos.validateDeactivateUser({ id: req.params.id });
    if (deactivateError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, deactivateError.message);
    }

    const deactivatedUser = await userServices.deactivateUser(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: deactivatedUser
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /USERS/ACTIVATE/:ID
export const handleActivateUser = async (req, res, next) => {
  try {
    const [activateError, validatedParams] = userDtos.validateActivateUser({ id: req.params.id });
    if (activateError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, activateError.message);
    }

    const activatedUser = await userServices.activateUser(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: activatedUser
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /USERS/:ID
export const handleDeleteUser = async (req, res, next) => {
  try {
    const [deleteError, validatedParams] = userDtos.validateDeleteUser({ id: req.params.id });
    if (deleteError) {
      throw errorWithStatus(HTTP_STATUSES.FAIL_BAD_REQUEST_400, deactivateError.message);
    }

    const deletedUser = await userServices.deleteUser(validatedParams, req.user);

    res.status(HTTP_STATUSES.SUCCESS_OK_200).json({
      success: true,
      data: deletedUser
    });
  } catch (error) {
    next(error);
  }
};