import COMMON_SORTS from '../common/common.sort.mjs';
import COMMENT_DIRECTIONS from '../comment/common/comment.direction.mjs';
import {
  string, size, define, validate, coerce,
  number, boolean, enums, min, array,
  create, StructError
} from 'superstruct';
import isEmail from 'is-email';
import isUuid from 'is-uuid';

/*  
 * 상수
 */
const PASSWORD_MIN = 8;       // PASSWORD 최소 길이
const PASSWORD_MAX = 64;      // PASSWORD 최대 길이
const NAME_MIN = 1;           // NAME 최소 길이
const NAME_MAX = 64;          // NAME 최대 길이
const OFFSET_MIN = 0;         // OFFSET 최소 값
const LIMIT_MIN = 0;          // LIMIT 최소 값
const PRICE_MIN = 100;        // PRICE 최소 값
const TAGS_MIN = 1;           // TAGS 최소 길이
const QUERY_MIN = 0;          // QUERY 최소 길이
const QUERY_MAX = 128;        // QUERY 최대 길이
const DESCRIPTION_MIN = 1;    // DESCRIPTION 최소 길이
const DESCRIPTION_MAX = 512;  // DESCRIPTION 최대 길이
const TITLE_MIN = 1;          // TITLE 최소 길이
const TITLE_MAX = 64;         // TITLE 최대 길이
const CONTENT_MIN = 1;        // CONTENT 최소 길이
const CONTENT_MAX = 512;      // CONTENT 최대 길이
const TAKE_MIN = 0;           // TAKE 최소 값


/*  
 * 정규표현식
 */
// URL 정규표현식
// '/storage/' + '영문대소문자&숫자&.&_&-' + '.' + '영문소문자&숫자(2~5글자)'
const URL_REGEX = /^\/storage\/[a-zA-Z0-9._-]+\.[a-z0-9]{2,5}$/;
// EXT 정규표현식
// '.' + '영문소문자&숫자(2~5글자)'
const EXT_REGEX = /^[a-z0-9]{2,5}$/;
// IPV4 정규표현식
const IPV4_REGEX = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
// IPV6 정규표현식
const IPV6_REGEX = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})|(([0-9a-fA-F]{1,4}:){1,7}:)|(([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})|(([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2})|(([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3})|(([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4})|(([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5})|([0-9a-fA-F]{1,4}:)((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;


/*  
 * 유틸 메서드
 */
// 문자열을 Integer 형으로 변환하여 반환
const stringToInteger = (value) => {
  const integer = Number(value);
  if (!Number.isInteger(integer)) {
    throw new Error(`${value} is not an integer`);
  }
  return integer;
};

// 'true' -> true | 'false' -> false
// 문자열을 Boolean 형으로 변환하여 반환
const stringToBoolean = (value) => {
  if (value === 'true') {
    return true;
  }
  else if (value === 'false') {
    return false;
  }

  throw new Error(`${value} is not 'true' or 'false'`);
};

// '/storage/*.*'
const isUrl = (value) => {
  const isString = typeof value === 'string';
  const isUrl = URL_REGEX.test(value);
  return isString && isUrl;
};

// '*'
// 문자열인지 확인 후 EXT인지 확인
const isExt = (value) => {
  const isString = typeof value === 'string';
  const isExt = EXT_REGEX.test(value);
  return isString && isExt;
};

// '*.*.*.*'
// 문자열인지 확인 후 IPV4인지 확인
const isIpv4 = (value) => {
  const isString = typeof value === 'string';
  const isIpv4 = IPV4_REGEX.test(value);
  return isString && isIpv4;
};

// '*:*:*:*:*:*:*:*'
// '*::*:*:*:*'
// 문자열인지 확인 후 IPV6인지 확인
const isIpv6 = (value) => {
  const isString = typeof value === 'string';
  const isIpv6 = IPV6_REGEX.test(value);
  return isString && isIpv6;
}

// IPV4 혹은 IPV6인지 확인
const isIp = (value) => {
  return isIpv4(value) || isIpv6(value);
};

// COERCE 가 아닌 자료형 체크
export const validateObject = (param, object) => {
  const [error, result] = validate(param, object);
  return error ? [error, null] : [null, result];
};

// COERCE 인 자료형 체크
export const validateCoerce = (param, coerce) => {
  try {
    const result = param !== undefined ? create(param, coerce) : undefined;
    return [null, result];
  } catch (error) {
    if (error instanceof StructError) return [error, null];
    throw error;
  }
};

/*  
 * COERCE 자료형
 */
const Integer = coerce(number(), string(), stringToInteger);
const Bool = coerce(boolean(), string(), stringToBoolean);


/*  
 * 파라미터 정의
 */
// UUID(128비트 레이블 V4)
export const Uuid = define('Uuid', isUuid.v4);
// EMAIL(IS_EMAIL)
export const Email = define('Email', isEmail);
// PASSWORD(최소길이:8, 최대길이:64)
export const Password = size(string(), PASSWORD_MIN, PASSWORD_MAX);
// NAME(최소길이:1, 최대길이:64)
export const Name = size(string(), NAME_MIN, NAME_MAX);
// SHOW_INACTIVE(BOOLEAN)
export const ShowInactive = Bool;
// OFFSET(최소값:0)
export const Offset = min(Integer, OFFSET_MIN);
// LIMIT(최소값:0)
export const Limit = min(Integer, LIMIT_MIN);
// SORT(RECENT,OLDEST)
export const Sort = enums([COMMON_SORTS.RECENT, COMMON_SORTS.OLDEST]);
// QUERY(최소길이:0, 최대길이:126)
export const Query = size(string(), QUERY_MIN, QUERY_MAX);
// DESCRIPTION(최소길이:1, 최대길이:512)
export const Description = size(string(), DESCRIPTION_MIN, DESCRIPTION_MAX);
// PRICE(최소값:100)
export const Price = min(Integer, PRICE_MIN);
// TAGS(배열[UUID], 최소개수:1)
export const Tags = size(array(Uuid), TAGS_MIN);
// IMAGES(배열[UUID])
export const Images = array(Uuid);
// TITLE(최소길이:1, 최대길이:64)
export const Title = size(string(), TITLE_MIN, TITLE_MAX);
// CONTENT(최소길이:1, 최대길이:512)
export const Content = size(string(), CONTENT_MIN, CONTENT_MAX);
// CURSOR(128비트 레이블 V4)
export const Cursor = string(Uuid);
// TAKE(최소값:0)
export const Take = min(Integer, TAKE_MIN);
// DIRECTION(NEXT,PREV)
export const Direction = enums([COMMENT_DIRECTIONS.NEXT, COMMENT_DIRECTIONS.PREV]);
// URL(/storage/*.*)
export const Url = define('Url', isUrl);
// EXT(*)
export const Ext = define('Ext', isExt);
// IPV4(*.*.*.*)
export const Ipv4 = define('Ipv4', isIpv4);
// IPV6(*::*:*:*:*)
export const Ipv6 = define('Ipv6', isIpv6);
// IP(IPV4 || IPV6)
export const Ip = define('Ip', isIp);