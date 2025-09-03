import { createProduct, getProductList, updateProduct, likeProduct } from '../../src/services/products.service';
import * as productRepo from '../../src/repositories/product.repository';
import * as userRepo from '../../src/repositories/users.repository';
import * as productLikeRepo from '../../src/repositories/product-like.repository';
import { ProductEntity } from '../../src/entities/product.entity';
import { ProductLikeEntity } from '../../src/entities/product-like.entity';

describe('Products Service Unit Tests', () => {
  const mockUser = { id: 'user-123', email: 'user@test.com' };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createProduct', () => {
    it('상품 생성', async () => {
      const mockProduct = { id: 'prod-1', name: '테스트 상품', price: 1000 } as ProductEntity;

      jest.spyOn(userRepo, 'getUserReference').mockResolvedValue(mockUser as any);
      jest.spyOn(productRepo, 'createProductEntity').mockResolvedValue(mockProduct as any);

      const result = await createProduct(
        mockUser as any,
        {
          body: { name: '테스트 상품', description: 'desc', price: 1000, stock: 10 },
        } as any
      );

      expect(result).toEqual(mockProduct);
      expect(productRepo.createProductEntity).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductList', () => {
    it('상품 목록', async () => {
      const mockList = [[{ id: 'prod-1' }], 1];
      jest.spyOn(productRepo, 'getProductEntityList').mockResolvedValue(mockList as any);

      const result = await getProductList(mockUser as any, { query: {} } as any);

      expect(result).toHaveProperty('totalCount', 1);
      expect(Array.isArray(result.list)).toBe(true);
      expect(productRepo.getProductEntityList).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('상품 업데이트', async () => {
      const product = { id: 'prod-1', name: 'old', price: 1000, stock: 5, user: mockUser } as any;

      jest.spyOn(productRepo, 'getProductEntity').mockResolvedValue(product);
      jest.spyOn(productRepo, 'updateProductEntity').mockResolvedValue(product);

      const result = await updateProduct(
        mockUser as any,
        {
          params: { id: 'prod-1' },
          body: { name: 'new name' },
        } as any
      );

      expect(result.name).toBe('new name');
      expect(productRepo.updateProductEntity).toHaveBeenCalledWith(product);
    });
  });

  describe('likeProduct', () => {
    it('상품 좋아요 생성', async () => {
      const product = { id: 'prod-1' } as any;

      jest.spyOn(userRepo, 'getUserEntity').mockResolvedValue(mockUser as any);
      jest.spyOn(productRepo, 'getProductEntity').mockResolvedValue(product);
      jest.spyOn(productLikeRepo, 'getProductLikeEntity').mockResolvedValue(null);
      const createSpy = jest
        .spyOn(productLikeRepo, 'createProductLikeEntity')
        .mockResolvedValue(new ProductLikeEntity());

      await likeProduct(mockUser as any, { params: { id: 'prod-1' } } as any);

      expect(createSpy).toHaveBeenCalled();
    });

    it('상품 좋아요 삭제', async () => {
      const product = { id: 'prod-1' } as any;
      const like = { id: 'like-1' } as any;

      jest.spyOn(userRepo, 'getUserEntity').mockResolvedValue(mockUser as any);
      jest.spyOn(productRepo, 'getProductEntity').mockResolvedValue(product);
      jest.spyOn(productLikeRepo, 'getProductLikeEntity').mockResolvedValue(like);
      const deleteSpy = jest.spyOn(productLikeRepo, 'deleteProductLikeEntity').mockResolvedValue(undefined);

      await likeProduct(mockUser as any, { params: { id: 'prod-1' } } as any);

      expect(deleteSpy).toHaveBeenCalledWith(like);
    });
  });
});
