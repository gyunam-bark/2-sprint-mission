// 성공
const SUCCESS_OK_200 = 200;                 // 응답 성공
const SUCCESS_CREATED_201 = 201;            // 생성 성공

// 클라이언트 오류
const FAIL_BAD_REQUEST_400 = 400;           // 잘못된 요청
const FAIL_UNAUTHORIZED_401 = 401;          // 인증 필요
const FAIL_FORBIDDEN_403 = 403;             // 권한 필요
const FAIL_NOT_FOUND_404 = 404;             // 리소스 없음
const FAIL_CONFLICT_409 = 409;              // 중복 충돌

// 서버 오류
const FAIL_INTERNAL_SERVER_ERROR_500 = 500; // 일반 서버 에러

export default {
  SUCCESS_OK_200,
  SUCCESS_CREATED_201,
  FAIL_BAD_REQUEST_400,
  FAIL_UNAUTHORIZED_401,
  FAIL_FORBIDDEN_403,
  FAIL_NOT_FOUND_404,
  FAIL_CONFLICT_409,
  FAIL_INTERNAL_SERVER_ERROR_500
};