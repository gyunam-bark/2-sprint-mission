import { getHealthCheck } from './root-service.js';

export const handleHealthCheck = async (c) => {
  const data = getHealthCheck();

  const response = {
    success: true,
    data,
  };

  return c.json(response);
};
