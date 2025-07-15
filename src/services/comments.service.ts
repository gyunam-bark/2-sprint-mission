import { ArticleCommentLikeEntity } from '../entities/article-comment-like.entity';
import { ProductCommentLikeEntity } from '../entities/product-comment-like.entity';
import { COMMON_STATUS } from '../enums/common.enum';
import {
  createArticleCommentLikeEntity,
  deleteArticleCommentLikeEntity,
  getArticleCommentLikeEntity,
} from '../repositories/article-comment-like.repository';
import {
  deleteArticleCommentEntity,
  getArticleCommentEntity,
  updateArticleCommentEntity,
} from '../repositories/article-comment.repository';
import {
  createProductCommentLikeEntity,
  deleteProductCommentLikeEntity,
  getProductCommentLikeEntity,
} from '../repositories/product-comment-like.repository';
import {
  deleteProductCommentEntity,
  getProductCommentEntity,
  updateProductCommentEntity,
} from '../repositories/product-comment.repository';
import { getUserEntity, getUserEntityById } from '../repositories/users.repository';
import {
  ActivateArticleCommentRequest,
  DeactivateArticleCommentRequest,
  DeleteArticleCommentRequest,
  LikeArticleCommentRequest,
  UpdateArticleCommentRequest,
} from '../types/article-comment.type';
import { ForbiddenError, InternalServerError, UnauthorizedError } from '../types/error.type';
import { Payload } from '../types/payload.type';
import {
  ActivateProductCommentRequest,
  DeactivateProductCommentRequest,
  DeleteProductCommentRequest,
  LikeProductCommentRequest,
  UpdateProductCommentRequest,
} from '../types/product-comment.type';
import { comparePassword } from '../utils/password.util';
import { isUserMaster, isUserOwner } from '../utils/user.util';

export const updateProductComment = async (user: Payload, request: UpdateProductCommentRequest) => {
  const { params, body } = request;
  const { content } = body;

  const productComment = await getProductCommentEntity(params);

  if (!isUserMaster(user) && !isUserOwner(user, productComment)) {
    throw new ForbiddenError();
  }

  if (content) {
    productComment.content = content;
  }

  productComment.updatedAt = new Date();

  return await updateProductCommentEntity(productComment);
};

export const deactivateProductComment = async (user: Payload, request: DeactivateProductCommentRequest) => {
  const { params } = request;

  const productComment = await getProductCommentEntity(params);

  if (!isUserMaster(user) && !isUserOwner(user, productComment)) {
    throw new ForbiddenError();
  }

  productComment.deletedAt = new Date();
  productComment.status = COMMON_STATUS.INACTIVE;

  return await updateProductCommentEntity(productComment);
};

export const activateProductComment = async (request: ActivateProductCommentRequest) => {
  const { params } = request;

  const productComment = await getProductCommentEntity(params);
  productComment.deletedAt = null;
  productComment.updatedAt = new Date();
  productComment.status = COMMON_STATUS.ACTIVE;

  return await updateProductCommentEntity(productComment);
};

export const deleteProductComment = async (master: Payload, request: DeleteProductCommentRequest) => {
  const { params, body } = request;
  const { password } = body;

  const masterUser = await getUserEntityById(master.id);
  if (masterUser === null) {
    throw new InternalServerError();
  }

  const isValidPassword = await comparePassword(password, masterUser.password);
  if (!isValidPassword) {
    throw new UnauthorizedError();
  }

  await deleteProductCommentEntity(params);
};

export const likeProductComment = async (user: Payload, request: LikeProductCommentRequest) => {
  const { params } = request;

  const existUser = await getUserEntity({ id: user.id });
  const existProductComment = await getProductCommentEntity(params);
  const existLike = await getProductCommentLikeEntity({ user: existUser });

  if (existLike === null) {
    const like = new ProductCommentLikeEntity();
    like.user = existUser;
    like.productComment = existProductComment;

    await createProductCommentLikeEntity(like);
  } else {
    await deleteProductCommentLikeEntity(existLike);
  }
};

export const updateArticleComment = async (user: Payload, request: UpdateArticleCommentRequest) => {
  const { params, body } = request;
  const { content } = body;

  const articleComment = await getArticleCommentEntity(params);

  if (!isUserMaster(user) && !isUserOwner(user, articleComment)) {
    throw new ForbiddenError();
  }

  if (content) {
    articleComment.content = content;
  }

  articleComment.updatedAt = new Date();

  return await updateArticleCommentEntity(articleComment);
};

export const deactivateArticleComment = async (user: Payload, request: DeactivateArticleCommentRequest) => {
  const { params } = request;

  const articleComment = await getArticleCommentEntity(params);

  if (!isUserMaster(user) && !isUserOwner(user, articleComment)) {
    throw new ForbiddenError();
  }

  articleComment.deletedAt = new Date();
  articleComment.status = COMMON_STATUS.INACTIVE;

  return await updateArticleCommentEntity(articleComment);
};

export const activateArticleComment = async (request: ActivateArticleCommentRequest) => {
  const { params } = request;

  const articleComment = await getArticleCommentEntity(params);
  articleComment.deletedAt = null;
  articleComment.updatedAt = new Date();
  articleComment.status = COMMON_STATUS.ACTIVE;

  return await updateArticleCommentEntity(articleComment);
};

export const deleteArticleComment = async (master: Payload, request: DeleteArticleCommentRequest) => {
  const { params, body } = request;
  const { password } = body;

  const masterUser = await getUserEntityById(master.id);
  if (masterUser === null) {
    throw new InternalServerError();
  }

  const isValidPassword = await comparePassword(password, masterUser.password);
  if (!isValidPassword) {
    throw new UnauthorizedError();
  }

  await deleteArticleCommentEntity(params);
};

export const likeArticleComment = async (user: Payload, request: LikeArticleCommentRequest) => {
  const { params } = request;

  const existUser = await getUserEntity({ id: user.id });
  const existArticleComment = await getArticleCommentEntity(params);
  const existLike = await getArticleCommentLikeEntity({ user: existUser });

  if (existLike === null) {
    const like = new ArticleCommentLikeEntity();
    like.user = existUser;
    like.articleComment = existArticleComment;

    await createArticleCommentLikeEntity(like);
  } else {
    await deleteArticleCommentLikeEntity(existLike);
  }
};
