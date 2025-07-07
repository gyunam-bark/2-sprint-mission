import * as tagControllers from '../common/tag.controllers.mjs';
import TAG_TYPES from '../common/tag.type.mjs';

export const handleGetTagList = async (req, res, next) => {
  await tagControllers.handleGetTagList(req, res, next, TAG_TYPES.ARTICLE);
};

export const handleGetTag = async (req, res, next) => {
  await tagControllers.handleGetTag(req, res, next, TAG_TYPES.ARTICLE);
};

export const handleCreateTag = async (req, res, next) => {
  await tagControllers.handleCreateTag(req, res, next, TAG_TYPES.ARTICLE);
};

export const handleUpdateTag = async (req, res, next) => {
  await tagControllers.handleUpdateTag(req, res, next, TAG_TYPES.ARTICLE);
};

export const handleDeactivateTag = async (req, res, next) => {
  await tagControllers.handleDeactivateTag(req, res, next, TAG_TYPES.ARTICLE);
};

export const handleActivateTag = async (req, res, next) => {
  await tagControllers.handleActivateTag(req, res, next, TAG_TYPES.ARTICLE);
};

export const handleDeleteTag = async (req, res, next) => {
  await tagControllers.handleDeleteTag(req, res, next, TAG_TYPES.ARTICLE);
};