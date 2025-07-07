// PACKAGE
import { object, optional, validate } from 'superstruct';
// COMMON
import {
  Offset, Limit, Sort, Ext, Query,
  Name, Url, Uuid, validateObject,
  validateCoerce
} from '../common/common.dto.mjs';

/*  
 * 검증 객체
 */

// GET IMAGE LIST(offset?, limit?, sort?, ext?, query?)
const GetImageList = object({
  // COERCE: offset, limit
  sort: optional(Sort),
  ext: optional(Ext),
  query: optional(Query)
});

// CREATE IMAGE(name, ext, url)
const CreateImage = object({
  name: Name,
  ext: Ext,
  url: Url
});

// GET IMAGE(id)
// DELETE IMAGE(id)
const GetImageId = object({
  id: Uuid
});


/*  
 * 외부 공개용 메서드
 */
export const validateCreateImage = (data) => validate(data, CreateImage);
export const validateGetImage = (param) => validate(param, GetImageId);
export const validateDeleteImage = (param) => validate(param, GetImageId);
export const validateDownloadImage = (param) => validate(param, GetImageId);

export const validateGetImageList = (queries) => {
  const {
    offset, limit, sort, ext, query
  } = queries;

  const [objError, objectResult] = validateObject({ sort, query, ext }, GetImageList);
  if (objError) { return [objError, null]; }

  const [offsetError, coercedOffset] = validateCoerce(offset, Offset);
  const [limitError, coercedLimit] = validateCoerce(limit, Limit);

  const hasError = offsetError || limitError;
  if (hasError) { return [firstError, null]; }

  return [
    null,
    {
      ...objectResult,
      offset: coercedOffset,
      limit: coercedLimit,
    }
  ];
};