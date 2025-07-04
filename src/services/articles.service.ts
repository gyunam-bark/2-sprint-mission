import { getImageReference } from '../repositories/images.repository';
import { getArchiveUser, getUserEntity, getUserEntityById, getUserReference } from '../repositories/users.repository';
import { ForbiddenError, InternalServerError, UnauthorizedError } from '../types/error.type';
import { Payload } from '../types/payload.type';
import {
  ActivateArticleRequest,
  CreateArticleRequest,
  DeactivateArticleRequest,
  DeleteArticleRequest,
  GetArticleDetailRequest,
  GetArticleListRequest,
  LikeArticleRequest,
  UpdateArticleRequest,
} from '../types/article.type';
import { comparePassword } from '../utils/password.util';
import { sortToOrderBy } from '../utils/to.util';
import { isUserMaster, isUserOwner } from '../utils/user.util';
import { ArticleEntity } from '../entities/article.entity';
import { ArticleTagEntity } from '../entities/article-tag.entity';
import { getArticleTagReference } from '../repositories/article-tag.repository';
import { ArticleImageLinkEntity } from '../entities/article-image-link.entity';
import {
  activateArticleEntity,
  createArticleEntity,
  deactivateArticleEntity,
  deleteArticleEntity,
  getArticleEntity,
  getArticleEntityList,
  updateArticleEntity,
} from '../repositories/article.repository';
import {
  createArticleLikeEntity,
  deleteArticleLikeEntity,
  getArticleLikeEntity,
  getArticleLikeEntityList,
} from '../repositories/article-like.repository';
import { ArticleLikeEntity } from '../entities/article-like.entity';
import { CreateArticleCommentRequest, GetArticleCommentListRequest } from '../types/article-comment.type';
import { ArticleCommentEntity } from '../entities/article-comment.entity';
import { createArticleCommentEntity, getArticleCommentEntityList } from '../repositories/article-comment.repository';
import { getArticleCommentLikeEntityList } from '../repositories/article-comment-like.repository';

export const createArticle = async (user: Payload, request: CreateArticleRequest) => {
  const { body } = request;
  const { title, content, tags, images } = body;

  const article = new ArticleEntity();
  article.title = title;
  article.content = content;

  article.user = await getUserReference(user.id);

  if (tags) {
    const tagRefs: ArticleTagEntity[] = [];

    for (const tag of tags) {
      const tagRef = await getArticleTagReference(tag);
      tagRefs.push(tagRef);
    }

    article.tags.set(tagRefs);
  }

  if (images) {
    for (const image of images) {
      const imageRef = await getImageReference(image);

      const linkEntity = new ArticleImageLinkEntity();
      linkEntity.article = article;
      linkEntity.image = imageRef;

      article.images.add(linkEntity);
    }
  }

  return await createArticleEntity(article);
};

export const getArticleList = async (user: Payload, request: GetArticleListRequest) => {
  const { query } = request;
  const { offset, limit, sort, keyword, isLiked } = query;

  const where: Record<string, any> = {};

  if (isLiked !== undefined) {
    const articleLikeList = await getArticleLikeEntityList(
      { user: user.id },
      {
        populate: ['article'],
      }
    );

    const likedArticleIdList = articleLikeList.map((articleLike) => articleLike.article.id);

    if (likedArticleIdList.length === 0) {
      return {
        totalCount: 0,
        list: [],
      };
    }

    where.id = { $in: likedArticleIdList };
  }

  if (keyword) {
    const query = { $like: `%${keyword}%` };
    where.$or = [{ title: query }, { content: query }];
  }

  const orderBy = sortToOrderBy(sort);

  const options = {
    offset,
    limit,
    orderBy,
  };

  const articleList = await getArticleEntityList(where, options);

  const data = {
    totalCount: articleList[1],
    list: articleList[0],
  };

  return data;
};

export const getArticleDetail = async (request: GetArticleDetailRequest) => {
  const { params } = request;
  const product = await getArticleEntity(params);

  return product;
};

export const updateArticle = async (user: Payload, request: UpdateArticleRequest) => {
  const { params, body } = request;
  const { title, content, tags, images } = body;

  const article = await getArticleEntity(params);

  if (!isUserMaster(user) && !isUserOwner(user, article)) {
    throw new ForbiddenError();
  }

  if (title) {
    article.title = title;
  }
  if (content) {
    article.content = content;
  }

  if (tags) {
    const tagRefs: ArticleTagEntity[] = [];

    for (const tag of tags) {
      const tagRef = await getArticleTagReference(tag);
      tagRefs.push(tagRef);
    }

    article.tags.set(tagRefs);
  }
  if (images) {
    for (const image of images) {
      const imageRef = await getImageReference(image);

      const linkEntity = new ArticleImageLinkEntity();
      linkEntity.article = article;
      linkEntity.image = imageRef;

      article.images.add(linkEntity);
    }
  }

  return await updateArticleEntity(article);
};

export const deactivateArticle = async (request: DeactivateArticleRequest) => {
  const { params } = request;

  return await deactivateArticleEntity(params);
};

export const activateArticle = async (request: ActivateArticleRequest) => {
  const { params } = request;

  return await activateArticleEntity(params);
};

export const deleteArticle = async (master: Payload, request: DeleteArticleRequest) => {
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

  const archivedUser = await getArchiveUser();

  const data = { user: archivedUser };

  await deleteArticleEntity(params, data);
};

export const likeArticle = async (user: Payload, request: LikeArticleRequest) => {
  const { params } = request;

  const existUser = await getUserEntity({ id: user.id });
  const existArticle = await getArticleEntity(params);
  const existLike = await getArticleLikeEntity({ user: existUser });

  if (existLike === null) {
    const like = new ArticleLikeEntity();
    like.user = existUser;
    like.article = existArticle;

    await createArticleLikeEntity(like);
  } else {
    await deleteArticleLikeEntity(existLike);
  }
};

export const createArticleComment = async (user: Payload, request: CreateArticleCommentRequest) => {
  const { params, body } = request;
  const { content } = body;

  const existUser = await getUserEntity({ id: user.id });
  const existArticle = await getArticleEntity(params);

  const now = new Date();

  const articleComment = new ArticleCommentEntity();
  articleComment.user = existUser;
  articleComment.article = existArticle;
  articleComment.content = content;
  articleComment.createdAt = now;
  articleComment.updatedAt = now;

  return await createArticleCommentEntity(articleComment);
};

export const getArticleCommentList = async (user: Payload, request: GetArticleCommentListRequest) => {
  const { params, query } = request;
  const { offset, limit, sort, keyword, isLiked } = query;

  const where: Record<string, any> = {};

  if (isLiked !== undefined && isLiked) {
    const articleCommentLikeList = await getArticleCommentLikeEntityList(
      { user: user.id, articleComment: params.id },
      {
        populate: ['articleComment'],
      }
    );

    const likedArticleCommentIdList = articleCommentLikeList.map(
      (articleCommentLike) => articleCommentLike.articleComment.id
    );

    if (likedArticleCommentIdList.length === 0) {
      return {
        totalCount: 0,
        list: [],
      };
    }

    where.id = { $in: likedArticleCommentIdList };
  }

  if (keyword) {
    where.content = { $like: `${keyword}` };
  }

  const orderBy = sortToOrderBy(sort);

  const options = {
    offset,
    limit,
    orderBy,
  };

  const articleCommentList = await getArticleCommentEntityList(where, options);

  const data = {
    totalCount: articleCommentList[1],
    list: articleCommentList[0],
  };

  return data;
};
