import { eq } from 'drizzle-orm';
import { db } from '../db';
import { comparePassword, hashPassword } from '../utils/password.util';
import { users } from '../db/schema';
import { Payload } from '../types/auth.type';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';

export const signup = async (username: string, password: string, email: string) => {
  // 이메일 중복 체크
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    throw new Error('Email already exists');
  }

  // 유저네임 중복 체크
  const existingUser = await db.select().from(users).where(eq(users.username, username));
  if (existingUser.length > 0) {
    throw new Error('Username already exists');
  }

  // 비밀번호 해싱 후 저장
  const passwordHash = await hashPassword(password);
  const [inserted] = await db
    .insert(users)
    .values({ username, password: passwordHash, email })
    .returning({ id: users.id });

  return { message: 'User created', userId: inserted.id };
};

export const signin = async (email: string, password: string) => {
  // 유저 조회
  const [user] = await db.select().from(users).where(eq(users.email, email));
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
