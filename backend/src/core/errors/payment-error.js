import { AppError } from './app-error.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class PaymentError extends AppError {
  constructor(message = 'No se pudo procesar el pago') {
    super(message, HTTP_STATUS.PAYMENT_REQUIRED);
  }
}
