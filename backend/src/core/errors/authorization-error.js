import { AppError } from './app-error.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class AuthorizationError extends AppError {
  constructor(message = 'No tenés permiso para acceder a este recurso') {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}
