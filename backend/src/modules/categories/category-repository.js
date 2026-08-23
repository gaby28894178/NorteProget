import { Op } from 'sequelize';
import Category from './category-model.js';
import { NotFoundError, ConflictError } from '../../core/errors/index.js';

class CategoryRepository {
  /**
   * Obtiene todas las categorías con paginación y filtros
   */
  async findAll({
    page = 1,
    limit = 10,
    search,
    is_active,
    includeInactive = false,
  } = {}) {
    const offset = (page - 1) * limit;
    const where = {};

    // Por defecto, los clientes solo ven categorías activas
    if (!includeInactive) {
      where.is_active = true;
    } else if (typeof is_active === 'boolean') {
      where.is_active = is_active;
    }

    // Búsqueda por nombre o slug
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await Category.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    return { rows, count };
  }

  /**
   * Obtiene todas las categorías activas
   */
  async findActive() {
    return await Category.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']],
    });
  }

  /**
   * Obtiene una categoría por su ID
   */
  async findById(id) {
    const category = await Category.findByPk(id);

    if (!category) {
      throw new NotFoundError(`Categoría con ID ${id} no encontrada`);
    }

    return category;
  }

  /**
   * Obtiene una categoría por su slug
   */
  async findBySlug(slug) {
    const category = await Category.findOne({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundError(`Categoría con slug "${slug}" no encontrada`);
    }

    return category;
  }

  /**
   * Genera un slug/código único a partir del nombre.
   */
  async generateUniqueSlug(name) {
    const ignoredWords = new Set([
      'DE',
      'DEL',
      'LA',
      'EL',
      'LOS',
      'LAS',
      'Y',
      'PARA',
      'CON',
    ]);

    const words = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .filter((word) => !ignoredWords.has(word));

    if (words.length === 0) {
      throw new ConflictError(
        'No se pudo generar un código válido a partir del nombre',
      );
    }

    // Máximo 3 palabras significativas.
    // Cada palabra aporta sus primeras 3 letras.
    const prefix = words
      .slice(0, 3)
      .map((word) => word.substring(0, 3))
      .join('-');

    // Buscar códigos existentes con el mismo prefijo
    const existingCategories = await Category.findAll({
      where: {
        slug: {
          [Op.iLike]: `${prefix}-%`,
        },
      },
      attributes: ['slug'],
    });

    // Obtener los números utilizados
    const usedNumbers = existingCategories
      .map((category) => {
        const match = category.slug.match(
          new RegExp(`^${prefix}-(\\d+)$`, 'i'),
        );

        return match ? parseInt(match[1], 10) : null;
      })
      .filter((number) => number !== null);

    // Buscar el siguiente número disponible
    let nextNumber = 1;

    while (usedNumbers.includes(nextNumber)) {
      nextNumber++;
    }

    const suffix = String(nextNumber).padStart(3, '0');

    return `${prefix}-${suffix}`;
  }

  /**
   * Crea una nueva categoría.
   *
   * El slug debe haber sido generado automáticamente
   * por el Service.
   */
  async create(categoryData) {
    // Verificar que el slug no exista
    const existingCategory = await Category.findOne({
      where: {
        slug: categoryData.slug,
      },
    });

    if (existingCategory) {
      throw new ConflictError(`El slug "${categoryData.slug}" ya está en uso`);
    }

    const category = await Category.create({
      name: categoryData.name,
      slug: categoryData.slug,
      is_active:
        categoryData.is_active !== undefined ? categoryData.is_active : true,
    });

    return category;
  }

  /**
   * Actualiza una categoría existente.
   *
   * El slug es INMUTABLE.
   */
  async update(id, updates) {
    const category = await this.findById(id);

    // El slug nunca se actualiza.
    const allowedFields = ['name', 'is_active'];
    const filteredUpdates = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    await category.update(filteredUpdates);
    await category.reload();

    return category;
  }

  /**
   * Actualiza el estado de activación de una categoría
   */
  async updateStatus(id, is_active) {
    const category = await this.findById(id);

    await category.update({ is_active });
    await category.reload();

    return category;
  }

  /**
   * Elimina una categoría (hard delete)
   */
  async delete(id) {
    const category = await this.findById(id);

    await category.destroy();
  }

  /**
   * Verifica si existe una categoría con el ID dado
   */
  async existsById(id) {
    const count = await Category.count({
      where: { id },
    });

    return count > 0;
  }

  /**
   * Obtiene la cantidad total de categorías
   */
  async count({ is_active } = {}) {
    const where = {};

    if (typeof is_active === 'boolean') {
      where.is_active = is_active;
    }

    return await Category.count({ where });
  }
}

export default new CategoryRepository();
