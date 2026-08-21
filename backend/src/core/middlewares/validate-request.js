import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Middleware para validar los resultados de express-validator
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};
