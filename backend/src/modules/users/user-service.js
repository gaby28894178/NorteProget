// src/modules/users/user.service.js

import userRepository from './user-repository.js';
import { USER_ROLES } from '../../core/utils/constants.js';
import {
  AuthorizationError,
  ValidationError,
} from '../../core/errors/index.js';

class UserService {
  /**
   * Obtiene todos los usuarios con paginación y filtros
   */
  async findAll(filters) {
    const { page = 1, limit = 10, role, search, is_active } = filters;

    const result = await userRepository.findAll({
      page,
      limit,
      role,
      search,
      is_active,
    });

    return {
      users: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }

  /**
   * Obtiene un usuario por su ID
   */
  async findById(id) {
    return await userRepository.findById(id);
  }

  /**
   * Obtiene un usuario por su email (público, sin contraseña)
   */
  async findByEmail(email) {
    return await userRepository.findByEmail(email);
  }

  /**
   * Actualiza un usuario (solo datos personales)
   */
  async update(id, updates) {
    // Verificar que el usuario existe (regla de negocio)
    await userRepository.findById(id);

    // Verificar email duplicado si se está actualizando (regla de negocio)
    if (updates.email) {
      const existingUser = await userRepository.findByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new ValidationError(
          `El email ${updates.email} ya está registrado por otro usuario`,
        );
      }
    }

    // No permitir actualizar campos sensibles (regla de negocio)
    if (updates.role !== undefined) {
      throw new ValidationError(
        'No se puede actualizar el rol desde este método',
      );
    }

    if (updates.is_active !== undefined) {
      throw new ValidationError(
        'No se puede actualizar el estado desde este método',
      );
    }

    if (updates.password_hash !== undefined) {
      throw new ValidationError(
        'No se puede actualizar la contraseña desde este método',
      );
    }

    return await userRepository.update(id, updates);
  }

  /**
   * Actualiza el estado de activación de un usuario (solo admin)
   */
  async updateStatus(id, is_active, requestingUser) {
    // Verificar permisos (regla de negocio)
    if (!requestingUser || requestingUser.role !== USER_ROLES.ADMIN) {
      throw new AuthorizationError(
        'Solo los administradores pueden actualizar el estado de usuarios',
      );
    }

    // Verificar que el usuario existe (regla de negocio)
    await userRepository.findById(id);

    // No permitir que un admin se desactive a sí mismo (regla de negocio)
    if (requestingUser.id === id && is_active === false) {
      throw new ValidationError('No puedes desactivar tu propio usuario');
    }

    return await userRepository.updateStatus(id, is_active);
  }

  /**
   * Elimina un usuario (solo admin)
   */
  async delete(id, requestingUser) {
    // Verificar permisos (regla de negocio)
    if (!requestingUser || requestingUser.role !== USER_ROLES.ADMIN) {
      throw new AuthorizationError(
        'Solo los administradores pueden eliminar usuarios',
      );
    }

    // Verificar que el usuario existe (regla de negocio)
    await userRepository.findById(id);

    // No permitir que un admin se elimine a sí mismo (regla de negocio)
    if (requestingUser.id === id) {
      throw new ValidationError('No puedes eliminar tu propio usuario');
    }

    await userRepository.delete(id);
  }
}

export default new UserService();
