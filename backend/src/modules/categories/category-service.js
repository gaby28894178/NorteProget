// src/modules/categories/category.service.js

import categoryRepository from './category-repository.js';
import {
  ValidationError,
  AuthorizationError,
} from '../../core/errors/index.js';
import { USER_ROLES } from '../../core/utils/constants.js';

class CategoryService {
  /**
   * Obtiene todas las categorías con paginación y filtros
   */
  async findAll(filters = {}, requestingUser) {
    const { page = 1, limit = 10, search, is_active } = filters;

    // Si es admin, puede ver todas (incluyendo inactivas)
    const includeInactive = requestingUser?.role === USER_ROLES.ADMIN;

    const result = await categoryRepository.findAll({
      page,
      limit,
      search,
      is_active,
      includeInactive,
    });

    return {
      categories: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
    };
  }

  /**
   * Obtiene todas las categorías activas (para clientes)
   */
  async findActive() {
    return await categoryRepository.findActive();
  }

  /**
   * Obtiene una categoría por su ID
   */
  async findById(id) {
    return await categoryRepository.findById(id);
  }

  /**
   * Obtiene una categoría por su slug
   */
  async findBySlug(slug) {
    return await categoryRepository.findBySlug(slug);
  }

  /**
   * Crea una nueva categoría (solo admin)
   *
   * El slug se genera automáticamente a partir del nombre.
   * El cliente/admin NO puede proporcionar el slug manualmente.
   */
  async create(categoryData, requestingUser) {
    // Verificar permisos
    if (!requestingUser || requestingUser.role !== USER_ROLES.ADMIN) {
      throw new AuthorizationError(
        'Solo los administradores pueden crear categorías',
      );
    }

    // No permitir que el cliente/admin envíe el slug manualmente
    if (categoryData.slug !== undefined) {
      throw new ValidationError(
        'El slug de la categoría se genera automáticamente',
      );
    }

    // Generar slug único automáticamente
    const slug = await categoryRepository.generateUniqueSlug(categoryData.name);

    return await categoryRepository.create({
      ...categoryData,
      slug,
    });
  }

  /**
   * Actualiza una categoría (solo admin)
   *
   * El slug es inmutable y NO puede modificarse.
   */
  async update(id, updates, requestingUser) {
    // Verificar permisos
    if (!requestingUser || requestingUser.role !== USER_ROLES.ADMIN) {
      throw new AuthorizationError(
        'Solo los administradores pueden actualizar categorías',
      );
    }

    // Verificar que la categoría existe
    await categoryRepository.findById(id);

    // No permitir modificar el slug
    if (updates.slug !== undefined) {
      throw new ValidationError('El slug de la categoría no puede modificarse');
    }

    // Campos permitidos para actualización
    const allowedFields = ['name', 'is_active'];

    const invalidFields = Object.keys(updates).filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      throw new ValidationError(
        `Campos inválidos: ${invalidFields.join(', ')}`,
      );
    }

    return await categoryRepository.update(id, updates);
  }

  /**
   * Actualiza el estado de activación (solo admin)
   */
  async updateStatus(id, is_active, requestingUser) {
    // Verificar permisos
    if (!requestingUser || requestingUser.role !== USER_ROLES.ADMIN) {
      throw new AuthorizationError(
        'Solo los administradores pueden actualizar el estado de categorías',
      );
    }

    // Verificar que la categoría existe
    await categoryRepository.findById(id);

    return await categoryRepository.updateStatus(id, is_active);
  }

  /**
   * Elimina una categoría (solo admin)
   */
  async delete(id, requestingUser) {
    // Verificar permisos
    if (!requestingUser || requestingUser.role !== USER_ROLES.ADMIN) {
      throw new AuthorizationError(
        'Solo los administradores pueden eliminar categorías',
      );
    }

    // Verificar que la categoría existe
    await categoryRepository.findById(id);

    // TODO: Verificar si tiene productos asociados antes de eliminar

    await categoryRepository.delete(id);
  }
}

export default new CategoryService();
