// BCRYPT
// SALT_OR_ROUNDS 값이 늘어나면 보안성이 높아지는 대신 느려진다.
// 반대로 값이 줄어드면 보안성은 낮아지는 대신 빨라진다.
export const SALT_OR_ROUNDS_DEFAULT = 10;

// JWT
// TOKEN 유효 기간
export const TOKEN_EXPIRES_IN = '1h'