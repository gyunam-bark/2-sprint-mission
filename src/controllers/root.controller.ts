import { RequestHandler } from 'express';
import { getHealthCheck } from '../services/root.service';
import { successResponse } from '../utils/response.util';

export const handleGetHealthCheck: RequestHandler = async (req, res, next) => {
  const data = getHealthCheck();

  res.status(200).json(successResponse(data));
};
