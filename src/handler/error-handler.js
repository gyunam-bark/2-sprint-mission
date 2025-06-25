import { NODE_ENV_OPTION } from '../common/node-env.js';
import ENV from '../config/env.js';

export const errorHandler = (err, c) => {
  const isProduction = ENV.NODE_ENV === NODE_ENV_OPTION.PRODUCTION;
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (!isProduction) {
    console.error('[에러]', {
      message: err.message,
      stack: err.stack,
      details: err.details,
    });
  }

  return c.json(
    {
      success: false,
      error: {
        message,
        code: status,
        ...(err.details && { details: err.details }),
      },
    },
    status
  );
};
