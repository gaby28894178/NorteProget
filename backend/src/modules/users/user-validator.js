// src/modules/users/user.validator.js

import { body, param, query } from 'express-validator';
import { USER_ROLES } from '../../core/utils/constants.js';

// ============================================
// VALIDACIONES REUTILIZABLES
// ============================================

const validateUUID = param('id')
  .isUUID()
  .withMessage('El ID debe ser un UUID válido');

const validatePage = query('page')
  .optional()
  .isInt({ min: 1 })
  .withMessage('El número de página debe ser un entero mayor a 0')
  .toInt();

const validateLimit = query('limit')
  .optional()
  .isInt({ min: 1, max: 100 })
  .withMessage('El límite debe ser un entero entre 1 y 100')
  .toInt();

const validateRole = (field = 'role') =>
  body(field)
    .optional()
    .isIn(Object.values(USER_ROLES))
    .withMessage(
      `Rol inválido. Valores permitidos: ${Object.values(USER_ROLES).join(', ')}`,
    );

const validateRoleRequired = body('role')
  .notEmpty()
  .withMessage('El rol es requerido')
  .isIn(Object.values(USER_ROLES))
  .withMessage(
    `Rol inválido. Valores permitidos: ${Object.values(USER_ROLES).join(', ')}`,
  );

const validateIsActive = (field = 'is_active') =>
  body(field)
    .optional()
    .isBoolean()
    .withMessage('is_active debe ser true o false')
    .toBoolean();

const validateIsActiveRequired = body('is_active')
  .notEmpty()
  .withMessage('El estado es requerido')
  .isBoolean()
  .withMessage('is_active debe ser true o false')
  .toBoolean();

const validateSearch = query('search')
  .optional()
  .isString()
  .withMessage('La búsqueda debe ser texto')
  .trim();

const validateFullName = body('full_name')
  .notEmpty()
  .withMessage('El nombre completo es requerido')
  .isString()
  .withMessage('El nombre debe ser texto')
  .isLength({ min: 2 })
  .withMessage('El nombre debe tener al menos 2 caracteres')
  .trim();

const validateFullNameOptional = body('full_name')
  .optional()
  .isString()
  .withMessage('El nombre debe ser texto')
  .isLength({ min: 2 })
  .withMessage('El nombre debe tener al menos 2 caracteres')
  .trim();

const validateEmail = body('email')
  .notEmpty()
  .withMessage('El email es requerido')
  .isEmail()
  .withMessage('El formato del email es inválido')
  .normalizeEmail();

const validateEmailOptional = body('email')
  .optional()
  .isEmail()
  .withMessage('El formato del email es inválido')
  .normalizeEmail();

const validatePassword = body('password_hash')
  .notEmpty()
  .withMessage('La contraseña es requerida')
  .isString()
  .withMessage('La contraseña debe ser texto')
  .isLength({ min: 6 })
  .withMessage('La contraseña debe tener al menos 6 caracteres');

// ============================================
// VALIDACIONES PARA CADA ENDPOINT
// ============================================

/**
 * GET /users - Listar usuarios con filtros
 */
export const validateFindAll = [
  validatePage,
  validateLimit,
  validateRole(),
  validateSearch,
  validateIsActive(),
];

/**
 * GET /users/:id - Obtener usuario por ID
 */
export const validateFindById = [validateUUID];

/**
 * POST /users - Crear usuario
 */
export const validateCreate = [
  validateFullName,
  validateEmail,
  validatePassword,
  validateRole(),
  validateIsActive(),
];

/**
 * PUT /users/:id - Actualizar usuario
 */
export const validateUpdate = [
  validateUUID,
  validateFullNameOptional,
  validateEmailOptional,
  body('role')
    .optional()
    .custom(() => {
      throw new Error('No se puede actualizar el rol desde este endpoint');
    }),
  body('is_active')
    .optional()
    .custom(() => {
      throw new Error('No se puede actualizar el estado desde este endpoint');
    }),
  body('password_hash')
    .optional()
    .custom(() => {
      throw new Error(
        'No se puede actualizar la contraseña desde este endpoint',
      );
    }),
];

/**
 * PATCH /users/:id/status - Actualizar estado (solo admin)
 */
export const validateUpdateStatus = [validateUUID, validateIsActiveRequired];

/**
 * PATCH /users/:id/role - Actualizar rol (solo admin)
 */
export const validateUpdateRole = [validateUUID, validateRoleRequired];

/**
 * DELETE /users/:id - Eliminar usuario (solo admin)
 */
export const validateDelete = [validateUUID];

/**
 * GET /users/exists - Verificar existencia por email
 */
export const validateExistsByEmail = [
  query('email')
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El formato del email es inválido')
    .normalizeEmail(),
];
