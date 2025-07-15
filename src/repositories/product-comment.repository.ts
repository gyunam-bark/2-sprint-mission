import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { ProductCommentEntity } from '../entities/product-comment.entity';
import { getEm } from '../utils/mikro.util';
import { ProductCommentParams } from '../types/product-comment.type';
import { COMMON_STATUS } from '../enums/common.enum';

export const createProductCommentEntity = async (productComment: ProductCommentEntity) => {
  const em = await getEm();

  return em.persistAndFlush(productComment);
};

export const getProductCommentEntityList = async (
  where: FilterQuery<ProductCommentEntity>,
  options: FindOptions<ProductCommentEntity>
): Promise<[ProductCommentEntity[], number]> => {
  const em = await getEm();

  return await em.findAndCount(ProductCommentEntity, where, options);
};

export const getProductCommentEntity = async (
  where: FilterQuery<ProductCommentEntity>
): Promise<ProductCommentEntity> => {
  const em = await getEm();

  return await em.findOneOrFail(ProductCommentEntity, where);
};

export const updateProductCommentEntity = async (productComment: ProductCommentEntity) => {
  const em = await getEm();

  await em.persistAndFlush(productComment);

  return productComment;
};

export const deleteProductCommentEntity = async (params: ProductCommentParams) => {
  const em = await getEm();

  await em.nativeDelete(ProductCommentEntity, params);
};
