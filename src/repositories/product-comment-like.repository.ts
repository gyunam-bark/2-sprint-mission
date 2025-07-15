import { FilterQuery, FindOptions, Loaded } from '@mikro-orm/core';
import { ProductCommentLikeEntity } from '../entities/product-comment-like.entity';
import { getEm } from '../utils/mikro.util';

export const getProductCommentLikeEntityList = async <HINT extends string = never>(
  where: FilterQuery<ProductCommentLikeEntity>,
  options: FindOptions<ProductCommentLikeEntity, HINT>
): Promise<Loaded<ProductCommentLikeEntity, HINT>[]> => {
  const em = await getEm();

  return await em.find(ProductCommentLikeEntity, where, options);
};

export const getProductCommentLikeEntity = async (
  where: FilterQuery<ProductCommentLikeEntity>
): Promise<ProductCommentLikeEntity | null> => {
  const em = await getEm();

  return await em.findOne(ProductCommentLikeEntity, where);
};

export const createProductCommentLikeEntity = async (like: ProductCommentLikeEntity) => {
  const em = await getEm();

  await em.persistAndFlush(like);

  return like;
};

export const updateProductCommentLikeEntity = async (like: ProductCommentLikeEntity) => {
  const em = await getEm();

  await em.persistAndFlush(like);

  return like;
};

export const deleteProductCommentLikeEntity = async (like: ProductCommentLikeEntity) => {
  const em = await getEm();

  await em.nativeDelete(ProductCommentLikeEntity, like);
};
