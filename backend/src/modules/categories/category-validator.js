import { body, param, query } from 'express-validator';

// ============================================
// VALIDACIONES REUTILIZABLES
// ============================================

const validateUUID = param('id')
  .isUUID()
  .withMessage('El ID debe ser un UUID válido');

const validateSlugParam = param('slug')
  .notEmpty()
  .withMessage('El código de categoría es requerido')
  .isString()
  .withMessage('El código de categoría debe ser texto')
  .matches(/^[A-Z]{3}(?:-[A-Z]{3}){0,2}-\d{3}$/)
  .withMessage(
    'El código de categoría debe tener un formato válido, por ejemplo ROP-HOM-001',
  )
  .trim()
  .toUpperCase();

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

const validateSearch = query('search')
  .optional()
  .isString()
  .withMessage('La búsqueda debe ser texto')
  .trim();

const validateIsActiveQuery = query('is_active')
  .optional()
  .isBoolean()
  .withMessage('is_active debe ser true o false')
  .toBoolean();

const validateName = body('name')
  .notEmpty()
  .withMessage('El nombre de la categoría es requerido')
  .isString()
  .withMessage('El nombre debe ser texto')
  .isLength({ min: 2 })
  .withMessage('El nombre debe tener al menos 2 caracteres')
  .isLength({ max: 100 })
  .withMessage('El nombre no puede exceder los 100 caracteres')
  .trim();

const validateNameOptional = body('name')
  .optional()
  .isString()
  .withMessage('El nombre debe ser texto')
  .isLength({ min: 2 })
  .withMessage('El nombre debe tener al menos 2 caracteres')
  .isLength({ max: 100 })
  .withMessage('El nombre no puede exceder los 100 caracteres')
  .trim();

const validateIsActive = body('is_active')
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

// ============================================
// VALIDACIONES PARA CADA ENDPOINT
// ============================================

/**
 * GET /api/categories
 * Listar categorías con filtros
 */
export const validateFindAll = [
  validatePage,
  validateLimit,
  validateSearch,
  validateIsActiveQuery,
];

/**
 * GET /api/categories/:id
 * Obtener categoría por ID
 */
export const validateFindById = [validateUUID];

/**
 * GET /api/categories/slug/:slug
 * Obtener categoría por código
 */
export const validateFindBySlug = [validateSlugParam];

/**
 * POST /api/categories
 * Crear categoría
 *
 * El código se genera automáticamente en el Service.
 */
export const validateCreate = [validateName, validateIsActive];

/**
 * PUT /api/categories/:id
 * Actualizar categoría
 *
 * El código es inmutable.
 */
export const validateUpdate = [
  validateUUID,
  validateNameOptional,
  validateIsActive,
];

/**
 * PATCH /api/categories/:id/status
 * Actualizar estado
 */
export const validateUpdateStatus = [validateUUID, validateIsActiveRequired];

/**
 * DELETE /api/categories/:id
 * Eliminar categoría
 */
export const validateDelete = [validateUUID];
