// src/modules/users/user-router.js

import { Router } from 'express';
import userController from './user-controller.js';
import {
  validateFindAll,
  validateFindById,
  validateCreate,
  validateUpdate,
  validateUpdateStatus,
  validateUpdateRole,
  validateDelete,
  validateExistsByEmail,
} from './user-validator.js';
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
 *   name: Users
 *   description: Gestión de usuarios
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         full_name:
 *           type: string
 *           example: "Juan Carlos Pérez"
 *         email:
 *           type: string
 *           format: email
 *           example: "juan@email.com"
 *         role:
 *           type: string
 *           enum: [ADMIN, CUSTOMER]
 *           example: CUSTOMER
 *         is_active:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios con paginación y filtros
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Límite de registros por página
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, CUSTOMER]
 *         description: Filtrar por rol
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre o email
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo/inactivo
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
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
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores
 */
router.get(
  '/',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validateFindAll,
  validateRequest,
  userController.findAll,
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validateFindById,
  validateRequest,
  userController.findById,
);

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Obtiene un usuario por su email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get(
  '/email/:email',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  userController.findByEmail,
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario (solo datos personales)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 minLength: 2
 *                 example: "Juan Carlos Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juancarlos@email.com"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
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
 *                   example: "Usuario actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos o email ya registrado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: Conflicto - Email ya registrado por otro usuario
 */
router.put(
  '/:id',
  authenticate,
  validateUpdate,
  validateRequest,
  userController.update,
);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Actualiza el estado de activación de un usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
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
 *         description: Estado actualizado exitosamente
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
 *                   example: "Usuario desactivado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: Conflicto - No puedes desactivar tu propio usuario
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validateUpdateStatus,
  validateRequest,
  userController.updateStatus,
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: Conflicto - No puedes eliminar tu propio usuario
 */
router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validateDelete,
  validateRequest,
  userController.delete,
);

export default router;
