import { eq } from 'drizzle-orm';
import { db } from '../db';
import { comparePassword, hashPassword } from '../utils/password.util';
import { users } from '../db/schema';
import { Payload } from '../types/auth.type';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';

export const signup = async (username: string, password: string) => {
  const existingUser = await db.select().from(users).where(eq(users.username, username));
  if (existingUser.length > 0) {
    throw new Error('Username already exists');
  }

  const passwordHash = await hashPassword(password);
  const [inserted] = await db.insert(users).values({ username, password: passwordHash }).returning({ id: users.id });

  return { userId: inserted.id };
};

export const signin = async (username: string, password: string) => {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user) throw new Error('Invalid credentials');

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const payload: Payload = { id: user.id };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

export const refresh = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken) as Payload;
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const getUserById = async (id: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user || null;
};
