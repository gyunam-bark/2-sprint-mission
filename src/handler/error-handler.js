import { NODE_ENV_OPTION } from '../constant/constant.js';
import ENV from '../config/env.js';
import {
  isErrorInstanceOfHono,
  isErrorInstanceOfHttp,
  isErrorInstanceOfJoi,
  isErrorInstanceOfNode,
  saveLog,
} from '../util/error-util.js';

export const errorHandler = async (error, c) => {
  console.log(error);
  const isProduction = ENV.NODE_ENV === NODE_ENV_OPTION.PRODUCTION;

  let status = error.status || 500;
  let message = error.message || 'Internal Server Error';

  if (isErrorInstanceOfHttp(error)) {
    status = error.status;
    message = error.message;
  } else if (isErrorInstanceOfJoi(error)) {
    status = 400;
    message = isProduction ? 'Validation failed' : error.details?.[0]?.message;
  } else if (isErrorInstanceOfHono(error)) {
    status = error.status;
    message = error.message;
  } else if (isErrorInstanceOfNode(error)) {
    status = 500;
    message = error.message;
  }

  const savedLog = await saveLog(c, status, message);

  if (!isProduction) {
    console.error('[error]', savedLog);
  }

  return c.json(
    {
      success: false,
      error: savedLog,
    },
    status
  );
};
