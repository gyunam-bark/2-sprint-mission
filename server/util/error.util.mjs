export const errorWithStatus = (statusCode = 400, message = '') => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export default {
  errorWithStatus,
}; 