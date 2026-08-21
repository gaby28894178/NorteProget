// src/modules/users/user.controller.js

import userService from './user-service.js';
import { HTTP_STATUS } from '../../core/utils/constants.js';
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  AuthorizationError,
} from '../../core/errors/index.js';

class UserController {
  /**
   * GET /api/users
   * Obtiene todos los usuarios con paginación y filtros
   */
  async findAll(req, res, next) {
    try {
      const { page, limit, role, search, is_active } = req.query;

      const result = await userService.findAll({
        page,
        limit,
        role,
        search,
        is_active,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id
   * Obtiene un usuario por su ID
   */
  async findById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await userService.findById(id);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/email/:email
   * Obtiene un usuario por su email
   */
  async findByEmail(req, res, next) {
    try {
      const { email } = req.params;

      const user = await userService.findByEmail(email);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id
   * Actualiza un usuario (solo datos personales)
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const user = await userService.update(id, updates);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/users/:id/status
   * Actualiza el estado de activación (solo admin)
   */
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      const requestingUser = req.user; // Asumiendo que el middleware de auth agrega el usuario

      const user = await userService.updateStatus(
        id,
        is_active,
        requestingUser,
      );

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: `Usuario ${is_active ? 'activado' : 'desactivado'} exitosamente`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id
   * Elimina un usuario (solo admin)
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const requestingUser = req.user;

      await userService.delete(id, requestingUser);

      return res.status(HTTP_STATUS.NO_CONTENT).json({
        success: true,
        message: 'Usuario eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
