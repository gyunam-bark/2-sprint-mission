import bcrypt from 'bcrypt';
import { HttpError } from './error-util.js';

const SALT_OR_ROUND = 10;

// 비밀번호 암호화
export const hashPassword = async (password) => await bcrypt.hash(password, SALT_OR_ROUND);

// 비밀번호 비교
export const comparePassword = async (raw, hashed, doWhenError) => {
  const isValidPassword = await bcrypt.compare(raw, hashed);
  if (!isValidPassword) {
    await doWhenError;
    throw new HttpError(404, '비밀번호가 틀렸습니다.');
  }
  return isValidPassword;
};
