import { AppError } from './app-error.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}
