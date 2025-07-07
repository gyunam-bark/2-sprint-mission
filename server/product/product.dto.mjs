import { object, optional, validate } from 'superstruct';
import {
  Offset, Limit, Sort, Query, ShowInactive,
  Name, Description, Price, Tags, Images,
  Uuid, validateObject, validateCoerce
} from '../common/common.dto.mjs';

/*  
 * 검증 객체
 */

// GET PRODUCT LIST(offset?, limit?, sort?, query?, showInactive?)
const GetProductList = object({
  // offset, limit, showInactive 는 coerce 사용
  sort: optional(Sort),
  query: optional(Query),
});

// CREATE PRODUCT(name, description, price, tags, images?)
const CreateProduct = object({
  // COERCE: price
  name: Name,
  description: Description,
  tags: Tags,
  images: optional(Images)
});

// UPDATE PRODUCT(name?, description?, price?, tags?, images?)
const UpdateProduct = object({
  // COERCE: price
  name: optional(Name),
  description: optional(Description),
  tags: optional(Tags),
  images: optional(Images)
});

// GET PRODUCT(id)
// DEACTIVATE PRODUCT(id)
// ACTIVTE PRODUCT(id)
// DELETE PRODUCT(id)
const ProductId = object({
  id: Uuid
});

/*  
 * 외부 공개용 메서드
 */
export const validateGetProduct = (param) => validate(param, ProductId);
export const validateDeactivateProduct = (param) => validate(param, ProductId);
export const validateActivateProduct = (param) => validate(param, ProductId);
export const validateDeleteProduct = (param) => validate(param, ProductId);

// COERCE: POST PRODUCT
export const validateCreateProduct = (body) => {
  const {
    name, description, price, tags, images
  } = body;

  // OBJECT 검증
  const [objError, objectResult] = validateObject({ name, description, tags, images }, CreateProduct);
  if (objError) { return [objError, null]; }

  // COERCE 검증
  const [priceError, coercedPrice] = validateCoerce(price, Price);
  if (priceError) { return [priceError, null]; }

  return [
    null,
    {
      ...objectResult,
      price: coercedPrice,
    }
  ];
};

// COERCE: UPDATE PRODUCT
export const validateUpdateProduct = (body) => {
  const {
    name, description, price, tags, images
  } = body;

  // OBJECT 검증
  const [objError, objectResult] = validateObject({ name, description, tags, images }, UpdateProduct);
  if (objError) { return [objError, null]; }

  // COERCE 검증
  const [priceError, coercedPrice] = validateCoerce(price, Price);
  if (priceError) { return [priceError, null]; }

  return [
    null,
    {
      ...objectResult,
      price: coercedPrice,
    }
  ];
};

// COERCE: GET PRODUCT LIST
export const validateGetProductList = (queries) => {
  const {
    offset, limit, sort, query, showInactive
  } = queries;

  // OBJECT 검증
  const [objError, objectResult] = validateObject({ sort, query }, GetProductList);
  if (objError) { return [objError, null]; }

  // COERCE 검증
  const [offsetError, coercedOffset] = validateCoerce(offset, Offset);
  const [limitError, coercedLimit] = validateCoerce(limit, Limit);
  const [inactiveError, coercedShowInactive] = validateCoerce(showInactive, ShowInactive);

  const hasError = offsetError || limitError || inactiveError;
  if (hasError) { return [hasError, null]; }

  return [
    null,
    {
      ...objectResult,
      offset: coercedOffset,
      limit: coercedLimit,
      showInactive: coercedShowInactive
    }
  ];
};