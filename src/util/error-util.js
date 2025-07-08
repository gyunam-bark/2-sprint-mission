import prisma from '../prisma/prisma.js';
import { HTTPException } from 'hono/http-exception';
import { getIpFromContext, getMethodFromContext, getUrlFromContext } from './from-util.js';

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

export class LockedError extends HttpError {
  constructor(message = 'Locked') {
    super(423, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error') {
    super(500, message);
  }
}

export const saveLog = async (c, status, message) => {
  const ip = getIpFromContext(c);
  const url = await getUrlFromContext(c);
  const method = getMethodFromContext(c);
  const statusCode = String(status);

  const log = await prisma.log.create({
    data: {
      ip,
      url,
      method,
      statusCode,
      message,
    },
  });

  return log;
};

export const isErrorInstanceOfHttp = (error) => error instanceof HttpError;
export const isErrorInstanceOfJoi = (error) => error.isJoi;
export const isErrorInstanceOfHono = (error) => error instanceof HTTPException;
export const isErrorInstanceOfNode = (error) => error instanceof Error;
