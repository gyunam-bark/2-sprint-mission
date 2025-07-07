import {
  object, optional, validate
} from 'superstruct';
import {
  ShowInactive, Name, Uuid, Query, Sort,
  validateObject, validateCoerce
} from '../../common/common.dto.mjs';

/*  
 * 검증 객체
 */

// GET TAG LIST(showInactive?)
const GetTagList = object({
  // COERCE: showInactive
  sort: optional(Sort),
  query: optional(Query),
  //showInactive: optional(ShowInactive)
});

// CREATE PRODUCTTAG(name)
const CreateTag = object({
  name: Name
});

// UPDATE PRODUCTTAG(name?)
const UpdateTag = object({
  name: optional(Name)
});

// GET TAG(id)
// DEACTIVATE TAG(id)
// ACTIVTE TAG(id)
// DELETE TAG(id)
const TagId = object({
  id: Uuid
});


/*  
 * 외부 공개용 메서드
 */

export const validateCreateTag = (data) => validate(data, CreateTag);
export const validateUpdateTag = (data) => validate(data, UpdateTag);
export const validateGetTag = (param) => validate(param, TagId);
export const validateDeactivateTag = (param) => validate(param, TagId);
export const validateActivateTag = (param) => validate(param, TagId);
export const validateDeleteTag = (param) => validate(param, TagId);

export const validateGetTagList = (queries) => {
  const {
    sort, query, showInactive
  } = queries;

  const [objError, objectResult] = validateObject({ sort, query }, GetTagList);
  if (objError) { return [objError, null]; }

  const [inactiveError, coercedShowInactive] = validateCoerce(showInactive, ShowInactive);
  if (inactiveError) { return [inactiveError, null]; }

  return [
    null,
    {
      ...objectResult,
      showInactive: coercedShowInactive
    }
  ];
};