import { FilterQuery, FindOptions } from '@mikro-orm/core';
import { getEm } from '../utils/mikro.util';
import { ArticleCommentEntity } from '../entities/article-comment.entity';
import { ArticleCommentParams } from '../types/article-comment.type';

export const createArticleCommentEntity = async (articleComment: ArticleCommentEntity) => {
  const em = await getEm();

  return em.persistAndFlush(articleComment);
};

export const getArticleCommentEntityList = async (
  where: FilterQuery<ArticleCommentEntity>,
  options: FindOptions<ArticleCommentEntity>
): Promise<[ArticleCommentEntity[], number]> => {
  const em = await getEm();

  return await em.findAndCount(ArticleCommentEntity, where, options);
};

export const getArticleCommentEntity = async (
  where: FilterQuery<ArticleCommentEntity>
): Promise<ArticleCommentEntity> => {
  const em = await getEm();

  return await em.findOneOrFail(ArticleCommentEntity, where);
};

export const updateArticleCommentEntity = async (articleComment: ArticleCommentEntity) => {
  const em = await getEm();

  await em.persistAndFlush(articleComment);

  return articleComment;
};

export const deleteArticleCommentEntity = async (params: ArticleCommentParams) => {
  const em = await getEm();

  await em.nativeDelete(ArticleCommentEntity, params);
};
