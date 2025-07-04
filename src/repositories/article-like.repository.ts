import { FilterQuery, FindOptions, Loaded } from '@mikro-orm/core';
import { ArticleLikeEntity } from '../entities/article-like.entity';
import { getEm } from '../utils/mikro.util';

export const getArticleLikeEntityList = async <HINT extends string = never>(
  where: FilterQuery<ArticleLikeEntity>,
  options: FindOptions<ArticleLikeEntity, HINT>
): Promise<Loaded<ArticleLikeEntity, HINT>[]> => {
  const em = await getEm();

  return await em.find(ArticleLikeEntity, where, options);
};

export const getArticleLikeEntity = async (
  where: FilterQuery<ArticleLikeEntity>
): Promise<ArticleLikeEntity | null> => {
  const em = await getEm();

  return await em.findOne(ArticleLikeEntity, where);
};

export const createArticleLikeEntity = async (like: ArticleLikeEntity) => {
  const em = await getEm();

  await em.persistAndFlush(like);

  return like;
};

export const updateArticleLikeEntity = async (like: ArticleLikeEntity) => {
  const em = await getEm();

  await em.persistAndFlush(like);

  return like;
};

export const deleteArticleLikeEntity = async (like: ArticleLikeEntity) => {
  const em = await getEm();

  await em.nativeDelete(ArticleLikeEntity, like);
};
