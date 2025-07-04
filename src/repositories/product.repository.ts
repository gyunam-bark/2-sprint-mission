import { EntityData, FilterQuery, FindOptions } from '@mikro-orm/core';
import { ProductEntity } from '../entities/product.entity';
import { getEm } from '../utils/mikro.util';
import { ProductParams } from '../types/product.type';
import { PRODUCT_STATUS } from '../enums/product.enum';
import { COMMON_STATUS } from '../enums/common.enum';
import { ProductCommentEntity } from '../entities/product-comment.entity';

export const createProductEntity = async (product: ProductEntity): Promise<ProductEntity> => {
  const em = await getEm();

  await em.persistAndFlush(product);

  return product;
};

export const getProductEntityList = async (
  where: FilterQuery<ProductEntity>,
  options: FindOptions<ProductEntity>
): Promise<[ProductEntity[], number]> => {
  const em = await getEm();

  return await em.findAndCount(ProductEntity, where, options);
};

export const getProductEntity = async (where: FilterQuery<ProductEntity>): Promise<ProductEntity> => {
  const em = await getEm();

  return await em.findOneOrFail(ProductEntity, where);
};

export const updateProductEntity = async (product: ProductEntity): Promise<ProductEntity> => {
  const em = await getEm();

  await em.persistAndFlush(product);

  return product;
};

export const deactivateProductEntity = async (params: ProductParams): Promise<ProductEntity> => {
  const defaultData = {
    deletedAt: new Date(),
  };
  const productData = {
    ...defaultData,
    status: PRODUCT_STATUS.INACTIVE,
  };
  const commonData = {
    ...defaultData,
    status: COMMON_STATUS.INACTIVE,
  };

  const em = await getEm();

  await em.transactional(async (tx) => {
    await tx.nativeUpdate(ProductCommentEntity, { product: params.id }, commonData);
    await tx.nativeUpdate(ProductEntity, params, productData);
  });

  return await em.findOneOrFail(ProductEntity, params);
};

export const activateProductEntity = async (params: ProductParams): Promise<ProductEntity> => {
  const defaultData = {
    deletedAt: null,
    updatedAt: new Date(),
  };
  const productData = {
    ...defaultData,
    status: PRODUCT_STATUS.ACTIVE,
  };
  const commonData = {
    ...defaultData,
    status: COMMON_STATUS.ACTIVE,
  };

  const em = await getEm();

  await em.transactional(async (tx) => {
    await tx.nativeUpdate(ProductCommentEntity, { product: params.id }, commonData);
    await tx.nativeUpdate(ProductEntity, params, productData);
  });

  return await em.findOneOrFail(ProductEntity, params);
};

export const deleteProductEntity = async <T>(params: ProductParams, data: EntityData<T>) => {
  const em = await getEm();

  await em.transactional(async (tx) => {
    await tx.nativeUpdate(ProductCommentEntity, { product: params.id }, data);
    await tx.nativeDelete(ProductEntity, params);
  });
};
