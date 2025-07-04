import { COMMON_SORT } from '../enums/common.enum';

export type ArticleCommentCreateBody = {
  content: string;
};

export type ArticleCommentUpdateBody = {
  content?: string;
};

export type ArticleCommentDeleteBody = {
  password: string;
};

export type ArticleCommentParams = { id?: string };

export type ArticleCommentQuery = {
  offset?: number;
  limit?: number;
  sort?: COMMON_SORT;
  keyword?: string;
  isLiked?: boolean;
};

export type CreateArticleCommentRequest = { params: ArticleCommentParams; body: ArticleCommentCreateBody };

export type GetArticleCommentListRequest = { params: ArticleCommentParams; query: ArticleCommentQuery };

export type UpdateArticleCommentRequest = { params: ArticleCommentParams; body: ArticleCommentUpdateBody };

export type DeactivateArticleCommentRequest = { params: ArticleCommentParams };

export type ActivateArticleCommentRequest = { params: ArticleCommentParams };

export type DeleteArticleCommentRequest = { params: ArticleCommentParams; body: ArticleCommentDeleteBody };

export type LikeArticleCommentRequest = { params: ArticleCommentParams };
