import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const config = {
  app: {
    port: Number(requireEnv('PORT', '3002')),
    env: requireEnv('NODE_ENV', 'development'),
  },
  db: {
    host: requireEnv('DB_HOST', 'localhost'),
    port: Number(requireEnv('DB_PORT', '5432')),
    user: requireEnv('DB_USER', 'postgres'),
    password: requireEnv('DB_PASSWORD', 'postgres'),
    name: requireEnv('DB_NAME', 'sprint11'),
  },
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiration: requireEnv('JWT_ACCESS_EXPIRATION', '15m') as jwt.SignOptions['expiresIn'],
    refreshExpiration: requireEnv('JWT_REFRESH_EXPIRATION', '7d') as jwt.SignOptions['expiresIn'],
  },
};
