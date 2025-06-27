import { COMMON_STATUS } from '../constant/constant.js';
import { getExistArticleComment, getExistProductComment, toggleProductCommentLike } from '../util/comment-util.js';
import { comparePassword } from '../util/crypt-util.js';
import { isUserMaster, isUserOwner } from '../util/user-util.js';

export const updateProductComment = async (param, body, user) => {
  try {
    const { id } = param;
    const { content } = body;

    const existProductComment = await getExistProductComment({ id });

    if (!isUserMaster(user) && !isUserOwner(user.id, existProductComment.id)) {
      throw new HttpError(400, '권한이 없습니다.');
    }

    const updatedProductComment = await prisma.productComment.update({
      where: { id: existProductComment.id },
      data: {
        content,
      },
    });

    return updatedProductComment;
  } catch (error) {
    throw error;
  }
};

export const deactivateProductComment = async (param, user) => {
  try {
    const { id } = param;

    const existProductComment = await getExistProductComment({ id });

    if (!isUserMaster(user) && !isUserOwner(user.id, existProductComment.id)) {
      throw new HttpError(400, '권한이 없습니다.');
    }

    const data = { status: COMMON_STATUS.INACTIVE };

    const deactivatedProductComment = await prisma.productComment.update({
      where: { id: existProductComment.id },
      data: data,
    });

    return deactivatedProductComment;
  } catch (error) {
    throw error;
  }
};

export const activateProductComment = async (param) => {
  try {
    const { id } = param;

    const existProductComment = await getExistProductComment({ id });

    const data = { status: COMMON_STATUS.ACTIVE };

    const activatedProductComment = await prisma.productComment.update({
      where: { id: existProductComment.id },
      data: data,
    });

    return activatedProductComment;
  } catch (error) {
    throw error;
  }
};

export const deleteProductComment = async (param, body, master) => {
  try {
    const { id } = param;
    const { password } = body;

    await comparePassword(password, master.password);

    const deletedProductComment = await prisma.productComment.delete({
      where: { id: id },
    });

    return deletedProductComment;
  } catch (error) {
    throw error;
  }
};

export const likeProductComment = async (param, user) => {
  try {
    const { id } = param;

    const existProductComment = await getExistProductComment({ id });

    const likedProductComment = await toggleProductCommentLike(existProductComment.id, user.id);

    return likedProductComment;
  } catch (error) {
    throw error;
  }
};

export const updateArticleComment = async (param, body, user) => {
  try {
    const { id } = param;
    const { content } = body;

    const existArticleComment = await getExistArticleComment({ id });

    if (!isUserMaster(user) && !isUserOwner(user.id, existArticleComment.id)) {
      throw new HttpError(400, '권한이 없습니다.');
    }

    const updatedArticleComment = await prisma.articleComment.update({
      where: { id: existArticleComment.id },
      data: {
        content,
      },
    });

    return updatedArticleComment;
  } catch (error) {
    throw error;
  }
};

export const deactivateArticleComment = async (param, user) => {
  try {
    const { id } = param;

    const existArticleComment = await getExistArticleComment({ id });

    if (!isUserMaster(user) && !isUserOwner(user.id, existArticleComment.id)) {
      throw new HttpError(400, '권한이 없습니다.');
    }

    const data = { status: COMMON_STATUS.INACTIVE };

    const deactivatedArticleComment = await prisma.articleComment.update({
      where: { id: existArticleComment.id },
      data: data,
    });

    return deactivatedArticleComment;
  } catch (error) {
    throw error;
  }
};

export const activateArticleComment = async (param, body, user) => {
  try {
    const { id } = param;

    const existArticleComment = await getExistArticleComment({ id });

    const data = { status: COMMON_STATUS.ACTIVE };

    const activatedArticleComment = await prisma.articleComment.update({
      where: { id: existArticleComment.id },
      data: data,
    });

    return activatedArticleComment;
  } catch (error) {
    throw error;
  }
};

export const deleteArticleComment = async (param, body, master) => {
  try {
    const { id } = param;
    const { password } = body;

    await comparePassword(password, master.password);

    const deletedArticleComment = await prisma.articleComment.delete({
      where: { id: id },
    });

    return deletedArticleComment;
  } catch (error) {
    throw error;
  }
};

export const likeArticleComment = async (param, user) => {
  try {
    const { id } = param;

    const existArticleComment = await getExistProductComment({ id });

    const isLiked = await toggleProductCommentLike(existArticleComment.id, user.id);

    return isLiked;
  } catch (error) {
    throw error;
  }
};
