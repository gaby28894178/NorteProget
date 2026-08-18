import userRepository from './user-repository.js';
import { USER_ROLES } from '../../core/utils/constants.js';
import {
  ValidationError,
  AuthorizationError,
} from '../../core/errors/index.js';

class UserService {
  /**
   * Obtiene todos los usuarios con paginación y filtros
   */
  async findAll(filters) {
    const { page = 1, limit = 10, role, search, is_active } = filters;

    // Validar página y límite
    if (page < 1) {
      throw new ValidationError('El número de página debe ser mayor a 0');
    }

    if (limit < 1 || limit > 100) {
      throw new ValidationError('El límite debe estar entre 1 y 100');
    }

    // Si se filtra por rol, validar que sea válido
    if (role && !Object.values(USER_ROLES).includes(role)) {
      throw new ValidationError(`Rol inválido: ${role}`);
    }

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
    if (!id) {
      throw new ValidationError('El ID del usuario es requerido');
    }

    return await userRepository.findById(id);
  }

  /**
   * Obtiene un usuario por su email (público, sin contraseña)
   */
  async findByEmail(email) {
    if (!email) {
      throw new ValidationError('El email es requerido');
    }

    return await userRepository.findByEmail(email);
  }

  /**
   * Crea un nuevo usuario
   */
  async create(userData) {
    // Validaciones
    if (!userData.full_name) {
      throw new ValidationError('El nombre completo es requerido');
    }

    if (!userData.email) {
      throw new ValidationError('El email es requerido');
    }

    if (!userData.password_hash) {
      throw new ValidationError('La contraseña es requerida');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new ValidationError('El formato del email es inválido');
    }

    // Validar que el nombre no esté vacío
    if (userData.full_name.trim().length < 2) {
      throw new ValidationError('El nombre debe tener al menos 2 caracteres');
    }

    // Si se especifica un rol, validar que sea válido
    if (userData.role && !Object.values(USER_ROLES).includes(userData.role)) {
      throw new ValidationError(`Rol inválido: ${userData.role}`);
    }

    return await userRepository.create(userData);
  }

  /**
   * Actualiza un usuario (solo datos personales)
   */
  async update(id, updates) {
    if (!id) {
      throw new ValidationError('El ID del usuario es requerido');
    }

    // Verificar que el usuario existe
    await userRepository.findById(id);

    // Validar email si viene
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        throw new ValidationError('El formato del email es inválido');
      }
    }

    // Validar nombre si viene
    if (updates.full_name && updates.full_name.trim().length < 2) {
      throw new ValidationError('El nombre debe tener al menos 2 caracteres');
    }

    // No permitir actualizar campos sensibles desde este método
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
    if (!id) {
      throw new ValidationError('El ID del usuario es requerido');
    }

    if (typeof is_active !== 'boolean') {
      throw new ValidationError('El estado debe ser un valor booleano');
    }

    // Verificar que el usuario que realiza la acción sea admin
    if (!requestingUser || requestingUser.role !== USER_ROLES.ADMIN) {
      throw new AuthorizationError(
        'Solo los administradores pueden actualizar el estado de usuarios',
      );
    }

    // Verificar que el usuario existe
    await userRepository.findById(id);

    // No permitir que un admin se desactive a sí mismo
    if (requestingUser.id === id && is_active === false) {
      throw new ValidationError('No puedes desactivar tu propio usuario');
    }

    return await userRepository.updateStatus(id, is_active);
  }

  /**
   * Actualiza el rol de un usuario (solo admin)
   */
  async updateRole(id, role, requestingUser) {
    if (!id) {
      throw new ValidationError('El ID del usuario es requerido');
    }

    if (!role) {
      throw new ValidationError('El rol es requerido');
    }

    // Verificar que el usuario que realiza la acción sea admin
    if (!requestingUser || requestingUser.role !== USER_ROLES.ADMIN) {
      throw new AuthorizationError(
        'Solo los administradores pueden actualizar el rol de usuarios',
      );
    }

    // Validar que el rol sea válido
    if (!Object.values(USER_ROLES).includes(role)) {
      throw new ValidationError(`Rol inválido: ${role}`);
    }

    // Verificar que el usuario existe
    await userRepository.findById(id);

    // No permitir que un admin se cambie el rol a sí mismo
    if (requestingUser.id === id) {
      throw new ValidationError('No puedes cambiar tu propio rol');
    }

    return await userRepository.updateRole(id, role);
  }

  /**
   * Elimina un usuario (solo admin)
   */
  async delete(id, requestingUser) {
    if (!id) {
      throw new ValidationError('El ID del usuario es requerido');
    }

    // Verificar que el usuario que realiza la acción sea admin
    if (!requestingUser || requestingUser.role !== USER_ROLES.ADMIN) {
      throw new AuthorizationError(
        'Solo los administradores pueden eliminar usuarios',
      );
    }

    // Verificar que el usuario existe
    await userRepository.findById(id);

    // No permitir que un admin se elimine a sí mismo
    if (requestingUser.id === id) {
      throw new ValidationError('No puedes eliminar tu propio usuario');
    }

    await userRepository.delete(id);
  }

  /**
   * Verifica si existe un usuario por email
   */
  async existsByEmail(email) {
    if (!email) {
      throw new ValidationError('El email es requerido');
    }

    return await userRepository.existsByEmail(email);
  }

  /**
   * Obtiene estadísticas de usuarios
   */
  async getStats() {
    const total = await userRepository.count();
    const totalActive = await userRepository.count({ is_active: true });
    const totalInactive = await userRepository.count({ is_active: false });
    const totalAdmins = await userRepository.count({ role: USER_ROLES.ADMIN });
    const totalCustomers = await userRepository.count({
      role: USER_ROLES.CUSTOMER,
    });

    return {
      total,
      active: totalActive,
      inactive: totalInactive,
      admins: totalAdmins,
      customers: totalCustomers,
    };
  }
}

// Exportar una instancia única del servicio
export default new UserService();
