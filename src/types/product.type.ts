import { COMMON_SORT } from '../enums/common.enum';

export type ProductCreateBody = {
  name: string;
  description: string;
  price: number;
  stock: number;
  tags?: string[];
  images?: string[];
};

export type ProductUpdateBody = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  tags?: string[];
  images?: string[];
};

export type CreateProductRequest = {
  body: ProductCreateBody;
};

export type ProductParams = { id?: string };

export type ProductQuery = { offset?: number; limit?: number; sort?: COMMON_SORT; keyword?: string; isLiked?: boolean };

export type ProductDeleteBody = { password: string };

export type GetProductListRequest = { params: ProductParams; query: ProductQuery };

export type GetProductDetailRequest = { params: ProductParams };

export type UpdateProductRequest = { params: ProductParams; body: ProductUpdateBody };

export type DeactivateProductRequest = { params: ProductParams };

export type ActivateProductRequest = { params: ProductParams };

export type DeleteProductRequest = { params: ProductParams; body: ProductDeleteBody };

export type LikeProductRequest = { params: ProductParams };
