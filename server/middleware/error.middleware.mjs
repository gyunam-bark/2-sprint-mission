const checkUploadError = (error) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'file size exceeds limit (max 10mb)' });
  }
};

const errorHandler = (error, req, res, next) => {
  checkUploadError(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;