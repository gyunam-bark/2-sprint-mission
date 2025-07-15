import { FilterQuery, FindOptions, Loaded } from '@mikro-orm/core';
import { ProductLikeEntity } from '../entities/product-like.entity';
import { getEm } from '../utils/mikro.util';

export const getProductLikeEntityList = async <HINT extends string = never>(
  where: FilterQuery<ProductLikeEntity>,
  options: FindOptions<ProductLikeEntity, HINT>
): Promise<Loaded<ProductLikeEntity, HINT>[]> => {
  const em = await getEm();

  return await em.find(ProductLikeEntity, where, options);
};

export const getProductLikeEntity = async (
  where: FilterQuery<ProductLikeEntity>
): Promise<ProductLikeEntity | null> => {
  const em = await getEm();

  return await em.findOne(ProductLikeEntity, where);
};

export const createProductLikeEntity = async (like: ProductLikeEntity) => {
  const em = await getEm();

  await em.persistAndFlush(like);

  return like;
};

export const updateProductLikeEntity = async (like: ProductLikeEntity) => {
  const em = await getEm();

  await em.persistAndFlush(like);

  return like;
};

export const deleteProductLikeEntity = async (like: ProductLikeEntity) => {
  const em = await getEm();

  await em.nativeDelete(ProductLikeEntity, like);
};
