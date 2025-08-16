import { FilterQuery, FindOptions, Loaded } from '@mikro-orm/core';
import { ProductLikeEntity } from '../entities/product-like.entity';
import { getEm } from '../utils/mikro.util';
import { UserEntity } from '../entities/user.entity';

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

export const getUserListWhoLikedProduct = async (productId: string): Promise<UserEntity[]> => {
  const em = await getEm();

  const likes = await em.find(
    ProductLikeEntity,
    {
      product: productId,
    },
    {
      populate: ['user'],
    }
  );

  return likes.map((like) => like.user);
};
