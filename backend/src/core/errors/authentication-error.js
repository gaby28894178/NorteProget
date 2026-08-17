import { AppError } from './app-error.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class AuthenticationError extends AppError {
  constructor(message = 'No autenticado') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}
