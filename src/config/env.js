import dotenv from 'dotenv';

dotenv.config();

const checkEnv = (name = '') => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing env[${name}]`);
  }
  return value;
};

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  DATABASE_URL: checkEnv('DATABASE_URL'),
  ACCESS_SECRET_KEY: checkEnv('ACCESS_SECERET_KEY'),
  REFRESH_SECRET_KEY: checkEnv('REFRESH_SECRET_KEY'),
  ACCESS_EXPIRY_UNIT: checkEnv('ACCESS_EXPIRY_UNIT'),
  REFRESH_EXPIRY_UNIT: checkEnv('REFRESH_EXPIRY_UNIT'),
  ACCESS_EXPIRY_VALUE: checkEnv('ACCESS_EXPIRY_VALUE'),
  REFRESH_EXPIRY_VALUE: checkEnv('REFRESH_EXPIRY_VALUE'),
  LOGIN_ATTEMPTS_MAX: process.env.LOGIN_ATTEMPTS_MAX || 5,
  MASTER_USER_DATA: checkEnv('MASTER_USER_DATA'),
  ARCHIVE_USER_DATA: checkEnv('ARCHIVE_USER_DATA'),
};

export default ENV;
