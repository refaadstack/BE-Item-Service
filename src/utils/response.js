export const sendErrorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
    data: null,
    timestamp: new Date().toISOString()
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

export const sendSuccessResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};
