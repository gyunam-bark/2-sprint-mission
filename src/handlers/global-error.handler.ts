import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import {
  isErrorInstanceOfHttp,
  isErrorInstanceOfMikro,
  isErrorInstanceOfNode,
  isErrorInstanceOfZod,
} from '../utils/error.util';
import { LogEntity } from '../entities/log.entity';
import { getIp, getMethod, getUrl } from '../utils/from.util';
import { createLogEntity } from '../repositories/log.repository';

export const globalErrorHandler: ErrorRequestHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let message = 'Internal Server Error';

  if (isErrorInstanceOfHttp(error)) {
    status = error.status;
    message = error.message;
  } else if (isErrorInstanceOfNode(error)) {
    status = 500;
    message = error.message;
  } else if (isErrorInstanceOfZod(error)) {
    status = 403;
    message = error.message;
  } else if (isErrorInstanceOfMikro(error)) {
    status = 403;
    message = error.message;
  }

  const log = new LogEntity();
  log.ip = getIp(req);
  log.method = getMethod(req);
  log.url = getUrl(req);
  log.statusCode = String(status);
  log.createdAt = new Date();

  await createLogEntity(log);

  console.error(log);

  const response = {
    success: false,
    error: {
      status,
      message,
    },
  };

  res.status(status).json(response);
};
