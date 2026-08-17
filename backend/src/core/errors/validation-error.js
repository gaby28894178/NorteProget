import { AppError } from './app-error.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class ValidationError extends AppError {
  constructor(message = 'Datos de entrada inválidos', errors = []) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }
}
