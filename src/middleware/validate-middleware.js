import Joi from 'joi';
import { setValidate } from '../util/validate-util.js';
import { getBodyFromContext, getParamFromContext, getQueryFromContext } from '../util/from-util.js';
import { COMMON_SORT } from '../constant/constant.js';

// ===========================================
// = AUTH
// ===========================================
export const registerSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    nickname: Joi.string().min(1).required(),
  }),
};

export const withdrawSchema = {
  body: Joi.object({
    password: Joi.string().min(8).required(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

// ===========================================
// = USERS
// ===========================================
export const getUserDetailSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const updateUserSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    email: Joi.string().email().optional(),
    nickname: Joi.string().min(1).optional(),
    password: Joi.string().min(8).optional(),
    image: Joi.string().optional(),
  }),
};
export const deactivateUserSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const activateUserSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const deleteUserSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    password: Joi.string().min(8).required(),
  }),
};
export const getUserListSchema = {
  query: Joi.object({
    skip: Joi.number().min(0).optional(),
    take: Joi.number().min(0).optional(),
    sort: Joi.string().valid(COMMON_SORT.LATEST, COMMON_SORT.OLDEST).optional(),
    keyword: Joi.string().optional(),
  }),
};
export const unlockUserSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

// ===========================================
// = IMAGES
// ===========================================
export const deleteImageSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

// ===========================================
// = PRODUCTS
// ===========================================
export const createProductSchema = {
  body: Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    price: Joi.number().min(1).required(),
    stock: Joi.number().min(0).optional(),
    tags: Joi.array().items(Joi.string().uuid()).min(0).optional(),
    images: Joi.array().items(Joi.string().uuid()).min(0).optional(),
  }),
};
export const getProductListSchema = {
  param: Joi.object({
    id: Joi.string().uuid().optional(),
  }),
  query: Joi.object({
    skip: Joi.number().min(0).optional(),
    take: Joi.number().min(0).optional(),
    sort: Joi.string().valid(COMMON_SORT.LATEST, COMMON_SORT.OLDEST).optional(),
    keyword: Joi.string().optional(),
    isLiked: Joi.bool().optional(),
  }),
};
export const getProductDetailSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const updateProductSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    name: Joi.string().min(1).optional(),
    description: Joi.string().min(1).optional(),
    price: Joi.number().min(1).optional(),
    stock: Joi.number().min(0).optional(),
    tags: Joi.array().items(Joi.string().uuid()).min(0).optional(),
    images: Joi.array().items(Joi.string().uuid()).min(0).optional(),
  }),
};
export const deactivateProductSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const activateProductSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const deleteProductSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    password: Joi.string().min(8).optional(),
  }),
};
export const likeProductSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

// ===========================================
// = PRODUCT COMMENTS
// ===========================================
export const getProductCommentListSchema = {
  param: Joi.object({
    id: Joi.string().uuid().optional(),
  }),
  query: Joi.object({
    skip: Joi.number().min(0).optional(),
    take: Joi.number().min(0).optional(),
    sort: Joi.string().valid(COMMON_SORT.LATEST, COMMON_SORT.OLDEST).optional(),
    keyword: Joi.string().optional(),
    isLiked: Joi.bool().optional(),
  }),
};
export const createProductCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    content: Joi.string().min(1).required(),
  }),
};
export const updateProductCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    content: Joi.string().min(1).required(),
  }),
};
export const deactivateProductCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const activateProductCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const deleteProductCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    password: Joi.string().min(8).optional(),
  }),
};
export const likeProductCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

// ===========================================
// = ARTICLES
// ===========================================
export const createArticleSchema = {
  body: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
    tags: Joi.array().items(Joi.string().uuid()).min(0).optional(),
    images: Joi.array().items(Joi.string().uuid()).min(0).optional(),
  }),
};
export const getArticleListSchema = {
  param: Joi.object({
    id: Joi.string().uuid().optional(),
  }),
  query: Joi.object({
    skip: Joi.number().min(0).optional(),
    take: Joi.number().min(0).optional(),
    sort: Joi.string().valid(COMMON_SORT.LATEST, COMMON_SORT.OLDEST).optional(),
    keyword: Joi.string().optional(),
    isLiked: Joi.bool().optional(),
  }),
};
export const getArticleDetailSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const updateArticleSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
    tags: Joi.array().items(Joi.string().uuid()).min(0).optional(),
    images: Joi.array().items(Joi.string().uuid()).min(0).optional(),
  }),
};
export const deactivateArticleSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const activateArticleSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const deleteArticleSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    password: Joi.string().min(8).optional(),
  }),
};
export const likeArticleSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

// ===========================================
// = ARTICLE COMMENTS
// ===========================================
export const getArticleCommentListSchema = {
  param: Joi.object({
    id: Joi.string().uuid().optional(),
  }),
  query: Joi.object({
    skip: Joi.number().min(0).optional(),
    take: Joi.number().min(0).optional(),
    sort: Joi.string().valid(COMMON_SORT.LATEST, COMMON_SORT.OLDEST).optional(),
    keyword: Joi.string().optional(),
    isLiked: Joi.bool().optional(),
  }),
};
export const createArticleCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    content: Joi.string().min(1).required(),
  }),
};
export const updateArticleCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    content: Joi.string().min(1).required(),
  }),
};
export const deactivateArticleCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const activateArticleCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};
export const deleteArticleCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    password: Joi.string().min(8).optional(),
  }),
};
export const likeArticleCommentSchema = {
  param: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

// ===========================================
// = MIDDLEWARE
// ===========================================
export const validate = (schema) => {
  return async (c, next) => {
    try {
      const validated = {};

      // BODY
      if (schema.body) {
        const body = await getBodyFromContext(c);
        const result = await schema.body.validateAsync(body, { abortEarly: false });
        validated.body = result;
      }

      // QUERY
      if (schema.query) {
        const query = getQueryFromContext(c);
        const result = await schema.query.validateAsync(query, { abortEarly: false });
        validated.query = result;
      }

      // PARAMS
      if (schema.param) {
        const param = getParamFromContext(c);
        const result = await schema.param.validateAsync(param, { abortEarly: false });
        validated.param = result;
      }

      setValidate(c, validated);

      return await next();
    } catch (err) {
      err.status = 400;
      err.message = '스키마 검증 에러';
      err.details = err.details?.map((d) => d.message) ?? [err.message];
      throw err;
    }
  };
};
