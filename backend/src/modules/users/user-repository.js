// src/modules/users/user-repository.js

import { Op } from 'sequelize';
import User from './user-model.js';
import { USER_ROLES } from '../../core/utils/constants.js';
import { NotFoundError, ConflictError } from '../../core/errors/index.js';

class UserRepository {
  /**
   * Obtiene todos los usuarios con paginación y filtros opcionales
   */
  async findAll({ page = 1, limit = 10, role, search, is_active } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    if (role && Object.values(USER_ROLES).includes(role)) {
      where.role = role;
    }

    if (typeof is_active === 'boolean') {
      where.is_active = is_active;
    }

    if (search) {
      where[Op.or] = [
        { full_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password_hash'] }, // No devolver la contraseña
    });

    return { rows, count };
  }

  /**
   * Obtiene un usuario por su ID
   */
  async findById(id, includePassword = false) {
    const attributes = includePassword
      ? undefined
      : { exclude: ['password_hash'] };

    const user = await User.findByPk(id, { attributes });

    if (!user) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  /**
   * Obtiene un usuario por su email
   */
  async findByEmail(email, includePassword = false) {
    const attributes = includePassword
      ? undefined
      : { exclude: ['password_hash'] };

    return await User.findOne({
      where: { email },
      attributes,
    });
  }

  /**
   * Obtiene un usuario por su email incluyendo la contraseña (para autenticación)
   */
  async findByEmailWithPassword(email) {
    return await User.findOne({
      where: { email },
    });
  }

  /**
   * Crea un nuevo usuario
   */
  async create(userData) {
    // Verificar si el email ya existe
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError(`El email ${userData.email} ya está registrado`);
    }

    const user = await User.create({
      full_name: userData.full_name,
      email: userData.email,
      password_hash: userData.password_hash,
      role: userData.role || USER_ROLES.CUSTOMER,
      is_active: userData.is_active !== undefined ? userData.is_active : true,
    });

    // Remover password_hash de la respuesta
    const userJson = user.toJSON();
    delete userJson.password_hash;

    return userJson;
  }

  /**
   * Actualiza un usuario existente
   */
  async update(id, updates) {
    const user = await this.findById(id, true); // Traer con contraseña para poder actualizar

    // Si se está actualizando el email, verificar que no esté en uso por otro usuario
    if (updates.email && updates.email !== user.email) {
      const existingUser = await this.findByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictError(
          `El email ${updates.email} ya está registrado por otro usuario`,
        );
      }
    }

    // Actualizar solo los campos proporcionados
    const allowedFields = ['full_name', 'email'];
    const filteredUpdates = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    await user.update(filteredUpdates);

    // Refrescar el usuario y remover contraseña
    await user.reload();
    const userJson = user.toJSON();
    delete userJson.password_hash;

    return userJson;
  }

  /**
   * Actualiza el estado de activación de un usuario
   */
  async updateStatus(id, is_active) {
    const user = await this.findById(id);
    await user.update({ is_active });
    await user.reload();

    const userJson = user.toJSON();
    delete userJson.password_hash;

    return userJson;
  }

  /**
   * Elimina un usuario (hard delete)
   */
  async delete(id) {
    const user = await this.findById(id);
    await user.destroy();
  }

  /**
   * Verifica si existe un usuario con el ID dado
   */
  async existsById(id) {
    const count = await User.count({ where: { id } });
    return count > 0;
  }

  /**
   * Obtiene la cantidad total de usuarios
   */
  async count({ role, is_active } = {}) {
    const where = {};

    if (role && Object.values(USER_ROLES).includes(role)) {
      where.role = role;
    }

    if (typeof is_active === 'boolean') {
      where.is_active = is_active;
    }

    return await User.count({ where });
  }
}

// Exportar una instancia única del repositorio
export default new UserRepository();
