// src/modules/auth/auth.controller.js

import authService from './auth-service.js';
import { HTTP_STATUS } from '../../core/utils/constants.js';
import userService from '../users/user-service.js';

class AuthController {
  /**
   * POST /api/auth/login
   * Login de usuario
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login exitoso',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/register
   * Registro de usuario
   */
  async register(req, res, next) {
    try {
      const userData = req.body;

      const result = await authService.register(userData);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresh token
   */
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshToken(refreshToken);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Token actualizado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/change-password
   * Cambiar contraseña
   */
  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      const result = await authService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Obtener perfil del usuario autenticado
   */
  async getProfile(req, res, next) {
    try {
      const user = req.user;

      // Obtener datos completos del usuario (sin contraseña)
      const userData = await userService.findById(user.id);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
