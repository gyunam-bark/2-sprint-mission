import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  app: {
    port: Number(requireEnv('PORT', '3000')),
    env: requireEnv('NODE_ENV', 'development'),
  },
  db: {
    host: requireEnv('DB_HOST'),
    port: Number(requireEnv('DB_PORT', '5432')),
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    name: requireEnv('DB_NAME'),
  },
};
