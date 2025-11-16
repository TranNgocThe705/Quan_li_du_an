import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

// Validate request middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));
    
    return errorResponse(res, 400, 'Validation failed', errorMessages);
  }
  
  next();
};
