import { ArticleCommentEntity } from '../entities/article-comment.entity';
import { ArticleEntity } from '../entities/article.entity';
import { ProductCommentEntity } from '../entities/product-comment.entity';
import { ProductEntity } from '../entities/product.entity';
import { UserEntity } from '../entities/user.entity';
import { COMMON_STATUS } from '../enums/common.enum';
import { PRODUCT_STATUS } from '../enums/product.enum';
import { USER_STATUS } from '../enums/user.enum';
import { UserParams } from '../types/user.type';
import { getEm } from '../utils/mikro.util';
import { EntityData, FilterQuery, FindOneOrFailOptions, FindOptions } from '@mikro-orm/core';

export const getUserEntityById = async (id: string): Promise<UserEntity | null> => {
  const em = await getEm();

  return await em.findOne(UserEntity, { id });
};

export const getUserEntityByEmail = async (email: string): Promise<UserEntity | null> => {
  const em = await getEm();

  return await em.findOne(UserEntity, { email });
};

export const getUserEntity = async (
  where: FilterQuery<UserEntity>,
  options?: FindOneOrFailOptions<UserEntity>
): Promise<UserEntity> => {
  const em = await getEm();

  return await em.findOneOrFail(UserEntity, where, options);
};

export const getUserEntityList = async (
  where: FilterQuery<UserEntity>,
  options?: FindOptions<UserEntity>
): Promise<[UserEntity[], number]> => {
  const em = await getEm();

  return await em.findAndCount(UserEntity, where, options);
};

export const updateUserEntity = async (updatedUserEntity: UserEntity): Promise<UserEntity> => {
  const em = await getEm();

  await em.persistAndFlush(updatedUserEntity);

  return updatedUserEntity;
};

export const deactivateUserEntity = async (params: UserParams): Promise<UserEntity> => {
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
  const userData = {
    ...defaultData,
    status: USER_STATUS.INACTIVE,
  };

  const em = await getEm();

  await em.transactional(async (tx) => {
    await tx.nativeUpdate(ProductEntity, { user: params.id }, productData);
    await tx.nativeUpdate(ArticleEntity, { user: params.id }, commonData);
    await tx.nativeUpdate(ProductCommentEntity, { user: params.id }, commonData);
    await tx.nativeUpdate(ArticleCommentEntity, { user: params.id }, commonData);
    await tx.nativeUpdate(UserEntity, params, userData);
  });

  return await em.findOneOrFail(UserEntity, params);
};

export const activateUserEntity = async (params: UserParams): Promise<UserEntity> => {
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
  const userData = {
    ...defaultData,
    status: USER_STATUS.ACTIVE,
  };

  const em = await getEm();

  await em.transactional(async (tx) => {
    await tx.nativeUpdate(ProductEntity, { user: params.id }, productData);
    await tx.nativeUpdate(ArticleEntity, { user: params.id }, commonData);
    await tx.nativeUpdate(ProductCommentEntity, { user: params.id }, commonData);
    await tx.nativeUpdate(ArticleCommentEntity, { user: params.id }, commonData);
    await tx.nativeUpdate(UserEntity, params, userData);
  });

  return await em.findOneOrFail(UserEntity, params);
};

export const getArchiveUser = async (): Promise<UserEntity> => {
  const em = await getEm();

  return await em.findOneOrFail(UserEntity, { isArchiveUser: true });
};

export const deleteUserEntity = async <T>(params: UserParams, data: EntityData<T>) => {
  const em = await getEm();

  await em.transactional(async (tx) => {
    await tx.nativeUpdate(ProductEntity, { user: params.id }, data);
    await tx.nativeUpdate(ArticleEntity, { user: params.id }, data);
    await tx.nativeUpdate(ProductCommentEntity, { user: params.id }, data);
    await tx.nativeUpdate(ArticleCommentEntity, { user: params.id }, data);
    await tx.nativeDelete(UserEntity, params);
  });
};

export const getUserReference = async (id: string): Promise<UserEntity> => {
  const em = await getEm();

  return em.getReference(UserEntity, id);
};
