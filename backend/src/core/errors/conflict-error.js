import { AppError } from './app-error.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe') {
    super(message, HTTP_STATUS.CONFLICT);
  }
}
