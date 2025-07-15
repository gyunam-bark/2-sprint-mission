import { EntityData, FilterQuery, FindOptions } from '@mikro-orm/core';
import { ArticleEntity } from '../entities/article.entity';
import { getEm } from '../utils/mikro.util';
import { ArticleParams } from '../types/article.type';
import { COMMON_STATUS } from '../enums/common.enum';
import { ArticleCommentEntity } from '../entities/article-comment.entity';

export const createArticleEntity = async (article: ArticleEntity): Promise<ArticleEntity> => {
  const em = await getEm();

  await em.persistAndFlush(article);

  return article;
};

export const getArticleEntityList = async (
  where: FilterQuery<ArticleEntity>,
  options: FindOptions<ArticleEntity>
): Promise<[ArticleEntity[], number]> => {
  const em = await getEm();

  return await em.findAndCount(ArticleEntity, where, options);
};

export const getArticleEntity = async (where: FilterQuery<ArticleEntity>): Promise<ArticleEntity> => {
  const em = await getEm();

  return await em.findOneOrFail(ArticleEntity, where);
};

export const updateArticleEntity = async (article: ArticleEntity): Promise<ArticleEntity> => {
  const em = await getEm();

  await em.persistAndFlush(article);

  return article;
};

export const deactivateArticleEntity = async (params: ArticleParams): Promise<ArticleEntity> => {
  const data = {
    deletedAt: new Date(),
    status: COMMON_STATUS.INACTIVE,
  };

  const em = await getEm();

  await em.transactional(async (tx) => {
    await tx.nativeUpdate(ArticleCommentEntity, { article: params.id }, data);
    await tx.nativeUpdate(ArticleEntity, params, data);
  });

  return await em.findOneOrFail(ArticleEntity, params);
};

export const activateArticleEntity = async (params: ArticleParams): Promise<ArticleEntity> => {
  const defaultData = {
    deletedAt: null,
    updatedAt: new Date(),
  };
  const commonData = {
    ...defaultData,
    status: COMMON_STATUS.ACTIVE,
  };

  const em = await getEm();

  await em.transactional(async (tx) => {
    await tx.nativeUpdate(ArticleCommentEntity, { article: params.id }, commonData);
    await tx.nativeUpdate(ArticleEntity, params, commonData);
  });

  return await em.findOneOrFail(ArticleEntity, params);
};

export const deleteArticleEntity = async <T>(params: ArticleParams, data: EntityData<T>) => {
  const em = await getEm();

  await em.transactional(async (tx) => {
    await tx.nativeUpdate(ArticleCommentEntity, { article: params.id }, data);
    await tx.nativeDelete(ArticleEntity, params);
  });
};
