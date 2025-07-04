import { COMMON_SORT } from '../enums/common.enum';

export type ProductCommentCreateBody = {
  content: string;
};

export type ProductCommentUpdateBody = {
  content?: string;
};

export type ProductCommentDeleteBody = {
  password: string;
};

export type ProductCommentParams = { id?: string };

export type ProductCommentQuery = {
  offset?: number;
  limit?: number;
  sort?: COMMON_SORT;
  keyword?: string;
  isLiked?: boolean;
};

export type CreateProductCommentRequest = { params: ProductCommentParams; body: ProductCommentCreateBody };

export type GetProductCommentListRequest = { params: ProductCommentParams; query: ProductCommentQuery };

export type UpdateProductCommentRequest = { params: ProductCommentParams; body: ProductCommentUpdateBody };

export type DeactivateProductCommentRequest = { params: ProductCommentParams };

export type ActivateProductCommentRequest = { params: ProductCommentParams };

export type DeleteProductCommentRequest = { params: ProductCommentParams; body: ProductCommentDeleteBody };

export type LikeProductCommentRequest = { params: ProductCommentParams };
