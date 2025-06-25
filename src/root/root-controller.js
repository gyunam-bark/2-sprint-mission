import { getHealthCheck } from './root-service.js';

export const handleHealthCheck = async (c) => {
  try {
    const data = getHealthCheck();

    const response = {
      success: true,
      data,
    };

    return c.json(response);
  } catch (error) {
    throw error;
  }
};
