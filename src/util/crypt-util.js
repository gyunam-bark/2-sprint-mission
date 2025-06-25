import bcrypt from 'bcrypt';

const SALT_OR_ROUND = 10;

// 비밀번호 암호화
export const hashPassword = async (password) => await bcrypt.hash(password, SALT_OR_ROUND);

// 비밀번호 비교
export const comparePassword = async (raw, hashed) => await bcrypt.compare(raw, hashed);
