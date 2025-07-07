import {
  object, optional, validate,
} from 'superstruct';
import {
  Offset, Limit, Sort, Query, ShowInactive,
  Email, Password, Name, Uuid, validateObject,
  validateCoerce
} from '../common/common.dto.mjs';

/*  
 * 검증 객체
 */

// GET USER LIST(offset?, limit?, sort?, query?, showInactive?)
const GetUserList = object({
  // COERCE : offset, limit, showInactive
  sort: optional(Sort),
  query: optional(Query),
});

// CREATE USER(email, password, name)
const CreateUser = object({
  email: Email,
  password: Password,
  name: Name
});

// UPDATE USER(name?, password?)
const UpdateUser = object({
  name: optional(Name),
  password: optional(Password)
});

// GET USER(id)
// DEACTIVATE USER(id)
// ACTIVTE USER(id)
// DELETE USER(id)
const UserId = object({
  id: Uuid
});


/*  
 * 외부 공개용 메서드
 */
export const validateCreateUser = (body) => validate(body, CreateUser);
export const validateUpdateUser = (body) => validate(body, UpdateUser);
export const validateGetUser = (param) => validate(param, UserId);
export const validateDeactivateUser = (param) => validate(param, UserId);
export const validateActivateUser = (param) => validate(param, UserId);
export const validateDeleteUser = (param) => validate(param, UserId);

// COERCE: GET USER LIST
export const validateGetUserList = (queries) => {
  const {
    offset, limit, sort, query, showInactive
  } = queries;

  const [objError, objectResult] = validateObject({ sort, query }, GetUserList);
  if (objError) { return [objError, null]; }

  const [offsetError, coercedOffset] = validateCoerce(offset, Offset);
  const [limitError, coercedLimit] = validateCoerce(limit, Limit);
  const [inactiveError, coercedShowInactive] = validateCoerce(showInactive, ShowInactive);

  const hasError = offsetError || limitError || inactiveError;
  if (hasError) { return [firstError, null]; }

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