import dotenv from 'dotenv';

dotenv.config();

const verifyEnv = (name: string): any => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing env[${name}]`);
  }
  return value;
};

const ENV = {
  NODE_ENV: verifyEnv('NODE_ENV'),
  PORT: verifyEnv('PORT'),
  DATABASE_URL: verifyEnv('DATABASE_URL'),
  ACCESS_SECRET_KEY: verifyEnv('ACCESS_SECERET_KEY'),
  REFRESH_SECRET_KEY: verifyEnv('REFRESH_SECRET_KEY'),
  ACCESS_EXPIRY_UNIT: verifyEnv('ACCESS_EXPIRY_UNIT'),
  REFRESH_EXPIRY_UNIT: verifyEnv('REFRESH_EXPIRY_UNIT'),
  ACCESS_EXPIRY_VALUE: verifyEnv('ACCESS_EXPIRY_VALUE'),
  REFRESH_EXPIRY_VALUE: verifyEnv('REFRESH_EXPIRY_VALUE'),
  LOGIN_ATTEMPTS_MAX: verifyEnv('LOGIN_ATTEMPTS_MAX'),
  MASTER_USER_DATA: verifyEnv('MASTER_USER_DATA'),
  ARCHIVE_USER_DATA: verifyEnv('ARCHIVE_USER_DATA'),
};

export default ENV;
