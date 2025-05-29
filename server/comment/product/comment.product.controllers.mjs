import * as commentControllers from '../common/comment.controllers.mjs';
import COMMENT_TYPES from '../common/comment.type.mjs';

export const handleGetCommentList = async (req, res, next) => {
  await commentControllers.handleGetCommentList(req, res, next, COMMENT_TYPES.PRODUCT);
}

export const handleGetComment = async (req, res, next) => {
  await commentControllers.handleGetComment(req, res, next, COMMENT_TYPES.PRODUCT);
}

export const handleCreateComment = async (req, res, next) => {
  await commentControllers.handleCreateComment(req, res, next, COMMENT_TYPES.PRODUCT);
}

export const handleUpdateComment = async (req, res, next) => {
  await commentControllers.handleUpdateComment(req, res, next, COMMENT_TYPES.PRODUCT);
}

export const handleDeactivateComment = async (req, res, next) => {
  await commentControllers.handleDeactivateComment(req, res, next, COMMENT_TYPES.PRODUCT);
}

export const handleActivateComment = async (req, res, next) => {
  await commentControllers.handleActivateComment(req, res, next, COMMENT_TYPES.PRODUCT);
}

export const handleDeleteComment = async (req, res, next) => {
  await commentControllers.handleDeleteComment(req, res, next, COMMENT_TYPES.PRODUCT);
}