import {
  object, optional, validate
} from 'superstruct';
import {
  Sort, Query, ShowInactive, Content,
  Cursor, Take, Direction, Uuid,
  validateObject, validateCoerce
} from '../../common/common.dto.mjs';

/*  
 * 검증 객체
 */

// GET COMMENT LIST(targetId?, cursor?, take?, direction?, sort?, query?, showInactive?)
const GetCommentList = object({
  // COERCE: take, showInactive
  targetId: optional(Uuid),
  cursor: optional(Cursor),
  direction: optional(Direction),
  sort: optional(Sort),
  query: optional(Query),
});

// CREATE COMMENT(targetId, userId, content)
const CreateComment = object({
  targetId: Uuid,
  userId: Uuid,
  content: Content
});

// UPDATE COMMENT(content?)
const UpdateComment = object({
  content: optional(Content)
});

// GET COMMENT(id)
// DEACTIVATE COMMENT(id)
// ACTIVTE COMMENT(id)
// DELETE COMMENT(id)
const CommentId = object({
  id: Uuid
});


/*  
 * 외부 공개용 메서드
 */
export const validateCreateComment = (data) => validate(data, CreateComment);
export const validateGetComment = (param) => validate(param, CommentId);
export const validateUpdateComment = (data) => validate(data, UpdateComment);
export const validateDeactivateComment = (param) => validate(param, CommentId);
export const validateActivateComment = (param) => validate(param, CommentId);
export const validateDeleteComment = (param) => validate(param, CommentId);
export const validateGetCommentList = (queries) => {
  const {
    targetId, cursor, take, direction, sort, query, showInactive
  } = queries;

  // OBJECT 검증
  const [objError, objectResult] = validateObject({ targetId, cursor, direction, sort, query }, GetCommentList);
  if (objError) { return [objError, null]; }

  // COERCE 검증
  const [takeError, coercedTake] = validateCoerce(take, Take);
  const [inactiveError, coercedShowInactive] = validateCoerce(showInactive, ShowInactive);

  const hasError = takeError || inactiveError;
  if (hasError) { return [hasError, null]; }

  return [
    null,
    {
      ...objectResult,
      take: coercedTake,
      showInactive: coercedShowInactive
    }
  ];
};