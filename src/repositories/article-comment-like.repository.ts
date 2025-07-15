import { FilterQuery, FindOptions, Loaded } from '@mikro-orm/core';
import { getEm } from '../utils/mikro.util';
import { ArticleCommentLikeEntity } from '../entities/article-comment-like.entity';

export const getArticleCommentLikeEntityList = async <HINT extends string = never>(
  where: FilterQuery<ArticleCommentLikeEntity>,
  options: FindOptions<ArticleCommentLikeEntity, HINT>
): Promise<Loaded<ArticleCommentLikeEntity, HINT>[]> => {
  const em = await getEm();

  return await em.find(ArticleCommentLikeEntity, where, options);
};

export const getArticleCommentLikeEntity = async (
  where: FilterQuery<ArticleCommentLikeEntity>
): Promise<ArticleCommentLikeEntity | null> => {
  const em = await getEm();

  return await em.findOne(ArticleCommentLikeEntity, where);
};

export const createArticleCommentLikeEntity = async (like: ArticleCommentLikeEntity) => {
  const em = await getEm();

  await em.persistAndFlush(like);

  return like;
};

export const updateArticleCommentLikeEntity = async (like: ArticleCommentLikeEntity) => {
  const em = await getEm();

  await em.persistAndFlush(like);

  return like;
};

export const deleteArticleCommentLikeEntity = async (like: ArticleCommentLikeEntity) => {
  const em = await getEm();

  await em.nativeDelete(ArticleCommentLikeEntity, like);
};
