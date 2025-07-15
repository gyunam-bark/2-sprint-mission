import { ArticleTagEntity } from '../entities/article-tag.entity';
import { getEm } from '../utils/mikro.util';

export const getArticleTagReference = async (id: string): Promise<ArticleTagEntity> => {
  const em = await getEm();

  return em.getReference(ArticleTagEntity, id);
};
