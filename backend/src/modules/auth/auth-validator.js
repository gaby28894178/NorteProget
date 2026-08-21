// src/modules/auth/auth.validator.js

import { body } from 'express-validator';

/**
 * Validaciones para login
 */
export const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El formato del email es inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isString()
    .withMessage('La contraseña debe ser texto')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

/**
 * Validaciones para registro
 */
export const validateRegister = [
  body('full_name')
    .notEmpty()
    .withMessage('El nombre completo es requerido')
    .isString()
    .withMessage('El nombre debe ser texto')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres')
    .trim(),

  body('email')
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El formato del email es inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isString()
    .withMessage('La contraseña debe ser texto')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
    ),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirmar contraseña es requerido')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Las contraseñas no coinciden'),
];

/**
 * Validaciones para refresh token
 */
export const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('El refresh token es requerido')
    .isString()
    .withMessage('El refresh token debe ser texto'),
];

/**
 * Validaciones para cambio de contraseña
 */
export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida')
    .isString()
    .withMessage('La contraseña actual debe ser texto'),

  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es requerida')
    .isString()
    .withMessage('La nueva contraseña debe ser texto')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
    ),
];

/**
 * Validaciones para forgot password
 */
export const validateForgotPassword = [
  body('email')
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El formato del email es inválido')
    .normalizeEmail(),
];

/**
 * Validaciones para reset password
 */
export const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('El token es requerido')
    .isString()
    .withMessage('El token debe ser texto'),

  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es requerida')
    .isString()
    .withMessage('La nueva contraseña debe ser texto')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
    ),
];
