import { COMMON_SORT } from '../enums/common.enum';

export type ArticleCreateBody = {
  title: string;
  content: string;
  tags?: string[];
  images?: string[];
};

export type ArticleUpdateBody = {
  title?: string;
  content?: string;
  tags?: string[];
  images?: string[];
};

export type CreateArticleRequest = {
  body: ArticleCreateBody;
};

export type ArticleParams = { id?: string };

export type ArticleQuery = { offset?: number; limit?: number; sort?: COMMON_SORT; keyword?: string; isLiked?: boolean };

export type ArticleDeleteBody = { password: string };

export type GetArticleListRequest = { params: ArticleParams; query: ArticleQuery };

export type GetArticleDetailRequest = { params: ArticleParams };

export type UpdateArticleRequest = { params: ArticleParams; body: ArticleUpdateBody };

export type DeactivateArticleRequest = { params: ArticleParams };

export type ActivateArticleRequest = { params: ArticleParams };

export type DeleteArticleRequest = { params: ArticleParams; body: ArticleDeleteBody };

export type LikeArticleRequest = { params: ArticleParams };
