import { ProductTagEntity } from '../entities/product-tag.entity';
import { getEm } from '../utils/mikro.util';

export const getProductTagReference = async (id: string): Promise<ProductTagEntity> => {
  const em = await getEm();

  return em.getReference(ProductTagEntity, id);
};
