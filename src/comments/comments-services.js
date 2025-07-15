import { COMMON_STATUS } from '../constant/constant.js';
import { getExistArticleComment, getExistProductComment, toggleProductCommentLike } from '../util/comment-util.js';
import { comparePassword } from '../util/crypt-util.js';
import { ForbiddenError } from '../util/error-util.js';
import { isUserMaster, isUserOwner } from '../util/user-util.js';

export const updateProductComment = async (param, body, user) => {
  const { id } = param;
  const { content } = body;

  const existProductComment = await getExistProductComment({ id });

  if (!isUserMaster(user) && !isUserOwner(user.id, existProductComment.id)) {
    throw new ForbiddenError();
  }

  const updatedProductComment = await prisma.productComment.update({
    where: { id: existProductComment.id },
    data: {
      content,
    },
  });

  return updatedProductComment;
};

export const deactivateProductComment = async (param, user) => {
  const { id } = param;

  const existProductComment = await getExistProductComment({ id });

  if (!isUserMaster(user) && !isUserOwner(user.id, existProductComment.id)) {
    throw new ForbiddenError();
  }

  const data = { status: COMMON_STATUS.INACTIVE };

  const deactivatedProductComment = await prisma.productComment.update({
    where: { id: existProductComment.id },
    data: data,
  });

  return deactivatedProductComment;
};

export const activateProductComment = async (param) => {
  const { id } = param;

  const existProductComment = await getExistProductComment({ id });

  const data = { status: COMMON_STATUS.ACTIVE };

  const activatedProductComment = await prisma.productComment.update({
    where: { id: existProductComment.id },
    data: data,
  });

  return activatedProductComment;
};

export const deleteProductComment = async (param, body, master) => {
  const { id } = param;
  const { password } = body;

  await comparePassword(password, master.password);

  const deletedProductComment = await prisma.productComment.delete({
    where: { id: id },
  });

  return deletedProductComment;
};

export const likeProductComment = async (param, user) => {
  const { id } = param;

  const existProductComment = await getExistProductComment({ id });

  const likedProductComment = await toggleProductCommentLike(existProductComment.id, user.id);

  return likedProductComment;
};

export const updateArticleComment = async (param, body, user) => {
  const { id } = param;
  const { content } = body;

  const existArticleComment = await getExistArticleComment({ id });

  if (!isUserMaster(user) && !isUserOwner(user.id, existArticleComment.id)) {
    throw new ForbiddenError();
  }

  const updatedArticleComment = await prisma.articleComment.update({
    where: { id: existArticleComment.id },
    data: {
      content,
    },
  });

  return updatedArticleComment;
};

export const deactivateArticleComment = async (param, user) => {
  const { id } = param;

  const existArticleComment = await getExistArticleComment({ id });

  if (!isUserMaster(user) && !isUserOwner(user.id, existArticleComment.id)) {
    throw new ForbiddenError();
  }

  const data = { status: COMMON_STATUS.INACTIVE };

  const deactivatedArticleComment = await prisma.articleComment.update({
    where: { id: existArticleComment.id },
    data: data,
  });

  return deactivatedArticleComment;
};

export const activateArticleComment = async (param, body, user) => {
  const { id } = param;

  const existArticleComment = await getExistArticleComment({ id });

  const data = { status: COMMON_STATUS.ACTIVE };

  const activatedArticleComment = await prisma.articleComment.update({
    where: { id: existArticleComment.id },
    data: data,
  });

  return activatedArticleComment;
};

export const deleteArticleComment = async (param, body, master) => {
  const { id } = param;
  const { password } = body;

  await comparePassword(password, master.password);

  const deletedArticleComment = await prisma.articleComment.delete({
    where: { id: id },
  });

  return deletedArticleComment;
};

export const likeArticleComment = async (param, user) => {
  const { id } = param;

  const existArticleComment = await getExistProductComment({ id });

  const isLiked = await toggleProductCommentLike(existArticleComment.id, user.id);

  return isLiked;
};
