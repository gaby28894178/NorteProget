import { Router } from 'express';
import categoryController from './category-controller.js';
import {
  validateFindAll,
  validateFindById,
  validateFindBySlug,
  validateCreate,
  validateUpdate,
  validateUpdateStatus,
  validateDelete,
} from './category-validator.js';
import { validateRequest } from '../../core/middlewares/validate-request.js';
import {
  authenticate,
  authorize,
} from '../../core/middlewares/auth-middleware.js';
import { USER_ROLES } from '../../core/utils/constants.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestión de categorías de productos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Ropa de Hombre"
 *         slug:
 *           type: string
 *           example: "ROP-HOM-001"
 *           readOnly: true
 *           description: Código único generado automáticamente por el backend.
 *         is_active:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtiene todas las categorías con paginación y filtros
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Límite de registros por página.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o código de categoría.
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo/inactivo. Solo aplica a administradores.
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 */
router.get('/', validateFindAll, validateRequest, categoryController.findAll);

/**
 * @swagger
 * /api/categories/active:
 *   get:
 *     summary: Obtiene todas las categorías activas
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categorías activas obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/active', categoryController.findActive);

/**
 * @swagger
 * /api/categories/slug/{slug}:
 *   get:
 *     summary: Obtiene una categoría por su código
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Z]{3}(-[A-Z]{3}){0,2}-[0-9]{3}$'
 *         example: ROP-HOM-001
 *         description: Código único generado automáticamente.
 *     responses:
 *       200:
 *         description: Categoría obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoría no encontrada.
 */
router.get(
  '/slug/:slug',
  validateFindBySlug,
  validateRequest,
  categoryController.findBySlug,
);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtiene una categoría por su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la categoría.
 *     responses:
 *       200:
 *         description: Categoría obtenida exitosamente.
 *       404:
 *         description: Categoría no encontrada.
 */
router.get(
  '/:id',
  validateFindById,
  validateRequest,
  categoryController.findById,
);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Ropa de Mujer"
 *                 description: Nombre de la categoría.
 *               is_active:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *                 description: Estado inicial de la categoría.
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Categoría creada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Solo administradores pueden crear categorías.
 *       409:
 *         description: Conflicto al generar el código de categoría.
 */
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validateCreate,
  validateRequest,
  categoryController.create,
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualiza una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la categoría.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Ropa de Hombre Premium"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *           description: El código de categoría es inmutable y no puede modificarse.
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Solo administradores pueden actualizar categorías.
 *       404:
 *         description: Categoría no encontrada.
 */
router.put(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validateUpdate,
  validateRequest,
  categoryController.update,
);

/**
 * @swagger
 * /api/categories/{id}/status:
 *   patch:
 *     summary: Actualiza el estado de una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la categoría.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_active
 *             properties:
 *               is_active:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Solo administradores pueden actualizar categorías.
 *       404:
 *         description: Categoría no encontrada.
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validateUpdateStatus,
  validateRequest,
  categoryController.updateStatus,
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Elimina una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la categoría.
 *     responses:
 *       204:
 *         description: Categoría eliminada exitosamente.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Solo administradores pueden eliminar categorías.
 *       404:
 *         description: Categoría no encontrada.
 */
router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validateDelete,
  validateRequest,
  categoryController.delete,
);

export default router;
