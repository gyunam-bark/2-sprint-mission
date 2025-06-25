import Joi from 'joi';
import { setValidate } from '../util/validate-util.js';
import { getBodyFromContext, getParamFromContext, getQueryFromContext } from '../util/from-util.js';

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
export const getUserListSchema = {
  body: Joi.object({}),
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
