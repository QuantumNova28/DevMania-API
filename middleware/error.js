import { ErrorResponse } from '../utils/errorResponse.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err);
  

  // Mongoose Bad Object ID
  if (err.name === 'CastError') {
    const message = `Resource not found with the id ${error.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const message = `Duplicate field entered`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'Validation Error') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400 );
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
