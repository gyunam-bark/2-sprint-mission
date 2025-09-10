import { eq } from 'drizzle-orm';
import { db } from '../db';
import { comparePassword, hashPassword } from '../utils/password.util';
import { users } from '../db/schema';
import { Payload } from '../types/auth.type';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';

export const signup = async (username: string, password: string) => {
  // 유저네임 중복 체크
  const existing = await db.select().from(users).where(eq(users.username, username));
  if (existing.length > 0) {
    throw new Error('Username already exists');
  }

  // 비밀번호 해싱 후 저장
  const existingUser = await db.select().from(users).where(eq(users.username, username));
  if (existingUser.length > 0) {
    throw new Error('Username already exists');
  }

  // 비밀번호 해싱 후 저장
  const passwordHash = await hashPassword(password);
  const [inserted] = await db.insert(users).values({ username, password: passwordHash }).returning({ id: users.id });

  return { message: 'User created', userId: inserted.id };
};

export const signin = async (username: string, password: string) => {
  // 유저 조회
  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user) throw new Error('Invalid credentials');

  // 비밀번호 검증
  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  // JWT 발급
  const payload: Payload = { id: user.id };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

export async function refresh(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken) as Payload;

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
