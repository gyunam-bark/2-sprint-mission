import * as z from 'zod/v4';
import { RequestHandler } from 'express';
import { Validated } from '../types/validated.type';
import { COMMON_SORT } from '../enums/common.enum';

// ===========================================
// = SCHEMA
// ===========================================
export interface Schema {
  params?: z.ZodObject;
  body?: z.ZodObject;
  query?: z.ZodObject;
}

// ===========================================
// = HEALTH_CHECK
// ===========================================
export const getHealthCheckSchema: Schema = {};

// ===========================================
// = AUTH
// ===========================================
export const registerSchema: Schema = {
  body: z.object({
    email: z.email(),
    password: z.string().min(4),
    nickname: z.string().min(1),
  }),
};
export const withdrawSchema = {
  body: z.object({
    password: z.string().min(8),
  }),
};
export const loginSchema: Schema = {
  body: z.object({
    email: z.email(),
    password: z.string().min(4),
  }),
};
export const logoutSchema: Schema = {};
export const refreshSchema: Schema = {};
// ===========================================
// = USERS
// ===========================================
export const getUserListSchema: Schema = {
  query: z.object({
    offset: z.number().min(0).optional(),
    limit: z.number().min(0).optional(),
    sort: z.enum([COMMON_SORT.LATEST, COMMON_SORT.OLDEST]).optional(),
    keyword: z.string().optional(),
  }),
};
export const getUserDetailSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const updateUserSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    email: z.email().optional(),
    nickname: z.string().min(1).optional(),
    password: z.string().min(4).optional(),
    image: z.uuid().optional(),
  }),
};
export const deactivateUserSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const activateUserSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const deleteUserSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    password: z.string().min(4),
  }),
};
export const unlockUserSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const lockUserSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
// ===========================================
// = PRODUCTS
// ===========================================
export const createProductSchema: Schema = {
  body: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(1),
    stock: z.number().min(0).optional(),
    tags: z.array(z.uuid()).min(0).optional(),
    images: z.array(z.uuid()).min(0).optional(),
  }),
};
export const getProductListSchema: Schema = {
  params: z.object({
    id: z.uuid().optional(),
  }),
  query: z.object({
    offset: z.number().min(0).optional(),
    limit: z.number().min(0).optional(),
    sort: z.enum([COMMON_SORT.LATEST, COMMON_SORT.OLDEST]).optional(),
    keyword: z.string().optional(),
    isLiked: z.coerce.boolean().optional(),
  }),
};
export const getProductDetailSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const updateProductSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().min(1).optional(),
    stock: z.number().min(0).optional(),
    tags: z.array(z.uuid()).min(0).optional(),
    images: z.array(z.uuid()).min(0).optional(),
  }),
};
export const deactivateProductSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const activateProductSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const deleteProductSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    password: z.string().min(4),
  }),
};
export const likeProductSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
// ===========================================
// = PRODUCT COMMENTS
// ===========================================
export const getProductCommentListSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({
    skip: z.number().min(0).optional(),
    take: z.number().min(0).optional(),
    sort: z.enum([COMMON_SORT.LATEST, COMMON_SORT.OLDEST]).optional(),
    keyword: z.string().optional(),
    isLiked: z.boolean().optional(),
  }),
};
export const createProductCommentSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    content: z.string().min(1),
  }),
};
export const updateProductCommentSchema: Schema = {
  params: z.object({
    id: z.uuid,
  }),
  body: z.object({
    content: z.string().min(1),
  }),
};
export const deactivateProductCommentSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const activateProductCommentSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const deleteProductCommentSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    password: z.string().min(4),
  }),
};
export const likeProductCommentSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
// ===========================================
// = ARTICLES
// ===========================================
export const createArticleSchema: Schema = {
  body: z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    tags: z.array(z.uuid()).min(0).optional(),
    images: z.array(z.uuid()).min(0).optional(),
  }),
};
export const getArticleListSchema: Schema = {
  params: z.object({
    id: z.uuid().optional(),
  }),
  query: z.object({
    offset: z.number().min(0).optional(),
    limit: z.number().min(0).optional(),
    sort: z.enum([COMMON_SORT.LATEST, COMMON_SORT.OLDEST]).optional(),
    keyword: z.string().optional(),
    isLiked: z.coerce.boolean().optional(),
  }),
};
export const getArticleDetailSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const updateArticleSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    tags: z.array(z.uuid()).min(0).optional(),
    images: z.array(z.uuid()).min(0).optional(),
  }),
};
export const deactivateArticleSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const activateArticleSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const deleteArticleSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    password: z.string().min(8).optional(),
  }),
};
export const likeArticleSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
// ===========================================
// = ARTICLE COMMENTS
// ===========================================
export const getArticleCommentListSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  query: z.object({
    skip: z.number().min(0).optional(),
    take: z.number().min(0).optional(),
    sort: z.enum([COMMON_SORT.LATEST, COMMON_SORT.OLDEST]).optional(),
    keyword: z.string().optional(),
    isLiked: z.boolean().optional(),
  }),
};
export const createArticleCommentSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    content: z.string().min(1),
  }),
};
export const updateArticleCommentSchema: Schema = {
  params: z.object({
    id: z.uuid,
  }),
  body: z.object({
    content: z.string().min(1),
  }),
};
export const deactivateArticleCommentSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const activateArticleCommentSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
export const deleteArticleCommentSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    password: z.string().min(4),
  }),
};
export const likeArticleCommentSchema: Schema = {
  params: z.object({
    id: z.uuid(),
  }),
};
// ===========================================
// = IMAGES
// ===========================================
export const uploadImageSchema: Schema = {};
export const getImageListSchema: Schema = {
  query: z.object({
    offset: z.number().min(0).optional(),
    limit: z.number().min(0).optional(),
    sort: z.enum([COMMON_SORT.LATEST, COMMON_SORT.OLDEST]).optional(),
    keyword: z.string().optional(),
    isLiked: z.boolean().optional(),
  }),
};
export const deleteImageSchema: Schema = {
  params: z.object({
    id: z.uuid().optional(),
  }),
};
// ===========================================
// = LOGS
// ===========================================
export const getLogListSchema: Schema = {
  query: z.object({
    skip: z.number().min(0).optional(),
    take: z.number().min(0).optional(),
    sort: z.enum([COMMON_SORT.LATEST, COMMON_SORT.OLDEST]).optional(),
    keyword: z.string().optional(),
  }),
};
export const deleteLogSchema: Schema = {
  params: z.object({
    id: z.uuid,
  }),
  body: z.object({
    password: z.string().min(4),
  }),
};

// ===========================================
// = NOTICES
// ===========================================
export const getNoticeListSchema: Schema = {
  params: z.object({
    id: z.uuid().optional(),
  }),
};

export const getNoticeSchema: Schema = {
  params: z.object({
    id: z.uuid().optional(),
  }),
};

// ===========================================
// = MIDDLEWARE
// ===========================================
export const validate = (schema: Schema): RequestHandler => {
  return async (req, res, next) => {
    const validated: Validated = {};

    // PARAMS
    if (schema.params) {
      const params = req.params;
      const result = await schema.params.parseAsync(params);
      validated.params = result;
    }

    // BODY
    if (schema.body) {
      const body = req.body;
      const result = await schema.body.parseAsync(body);
      validated.body = result;
    }

    // QUERY
    if (schema.query) {
      const query = req.query;
      const result = await schema.query.parseAsync(query);
      validated.query = result;
    }

    req.validated = validated;

    return next();
  };
};
