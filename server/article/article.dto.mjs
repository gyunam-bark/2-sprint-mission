import {
  object, optional, validate
} from 'superstruct';
import {
  Offset, Limit, Sort, Query, ShowInactive,
  Title, Content, Tags, Images, Uuid,
  validateObject, validateCoerce
} from '../common/common.dto.mjs';

/*  
 * 검증 객체
 */

// GET ARTICLE LIST(offset?, limit?, sort?, query?, showInactive?)
const GetArticleList = object({
  // COERCE: offset, limit, showInactive
  sort: optional(Sort),
  query: optional(Query)
});

// CREATE ARTICLE(title, content, tags, images?)
const CreateArticle = object({
  title: Title,
  content: Content,
  tags: Tags,
  images: optional(Images)
});

// UPDATE ARTICLE(title?, content?, price?, tags?, images?)
const UpdateArticle = object({
  title: optional(Title),
  content: optional(Content),
  tags: optional(Tags),
  images: optional(Images)
});

// GET ARTICLE(id)
// DEACTIVATE ARTICLE(id)
// ACTIVTE ARTICLE(id)
// DELETE ARTICLE(id)
const ArticleId = object({
  id: Uuid
});


/*  
 * 외부 공개용 메서드
 */
export const validateCreateArticle = (data) => validate(data, CreateArticle);
export const validateGetArticle = (param) => validate(param, ArticleId);
export const validateUpdateArticle = (data) => validate(data, UpdateArticle);
export const validateDeactivateArticle = (param) => validate(param, ArticleId);
export const validateActivateArticle = (param) => validate(param, ArticleId);
export const validateDeleteArticle = (param) => validate(param, ArticleId);
export const validateGetArticleList = (queries) => {
  const {
    offset, limit, sort, query, showInactive
  } = queries;

  // OBJECT 검증
  const [objError, objectResult] = validateObject({ sort, query }, GetArticleList);
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