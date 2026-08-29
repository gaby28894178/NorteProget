import { Op } from 'sequelize';

import Product from './product-model.js';
import ProductVariant from './product-variant-model.js';
import ProductImage from './product-image-model.js';

import { NotFoundError, ConflictError } from '../../core/errors/index.js';

class ProductRepository {
  /**
   * Obtiene todos los productos con paginación, filtros y relaciones.
   */
  async findAll({
    page = 1,
    limit = 10,
    search,
    category_id,
    status,
    includeInactive = false,
    includeVariants = false,
    includeImages = false,
  } = {}) {
    const offset = (page - 1) * limit;

    const where = {};

    if (!includeInactive) {
      where.status = 'PUBLISHED';
    } else if (status) {
      where.status = status;
    }

    if (category_id) {
      where.category_id = category_id;
    }

    if (search) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          slug: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const include = [];

    if (includeVariants) {
      include.push({
        model: ProductVariant,
        as: 'variants',
        where: {
          is_default: false,
        },
        required: false,
        separate: true,
        order: [['created_at', 'ASC']],
      });
    }

    if (includeImages) {
      include.push({
        model: ProductImage,
        as: 'images',
        required: false,
        separate: true,
        order: [['display_order', 'ASC']],
      });
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      distinct: true,
    });

    return {
      rows,
      count,
    };
  }

  /**
   * Obtiene todos los productos publicados.
   */
  async findPublished({ category_id, search, limit = 12, page = 1 } = {}) {
    return this.findAll({
      page,
      limit,
      search,
      category_id,
      includeInactive: false,
      includeVariants: true,
      includeImages: true,
    });
  }

  /**
   * Obtiene un producto por ID.
   */
  async findById(id, { includeVariants = true, includeImages = true } = {}) {
    const include = [];

    if (includeVariants) {
      include.push({
        model: ProductVariant,
        as: 'variants',
        where: {
          is_default: false,
        },
        required: false,
        separate: true,
        order: [['created_at', 'ASC']],
      });
    }

    if (includeImages) {
      include.push({
        model: ProductImage,
        as: 'images',
        required: false,
        separate: true,
        order: [['display_order', 'ASC']],
      });
    }

    const product = await Product.findByPk(id, {
      include,
    });

    if (!product) {
      throw new NotFoundError(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  /**
   * Obtiene un producto por su slug.
   */
  async findBySlug(
    slug,
    { includeVariants = true, includeImages = true } = {},
  ) {
    const include = [];

    if (includeVariants) {
      include.push({
        model: ProductVariant,
        as: 'variants',
        where: {
          is_default: false,
        },
        required: false,
        separate: true,
        order: [['created_at', 'ASC']],
      });
    }

    if (includeImages) {
      include.push({
        model: ProductImage,
        as: 'images',
        required: false,
        separate: true,
        order: [['display_order', 'ASC']],
      });
    }

    const product = await Product.findOne({
      where: { slug },
      include,
    });

    if (!product) {
      throw new NotFoundError(`Producto con slug "${slug}" no encontrado`);
    }

    return product;
  }

  /**
   * Genera un slug único para el producto.
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

    let cleanName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim();

    if (!cleanName) {
      cleanName = 'producto';
    }

    const words = cleanName
      .split(/\s+/)
      .filter(Boolean)
      .filter((word) => !ignoredWords.has(word.toUpperCase()));

    const baseSlug =
      words.length > 0 ? words.slice(0, 3).join('-') : 'producto';

    const existingProduct = await Product.findOne({
      where: {
        slug: baseSlug,
      },
    });

    if (!existingProduct) {
      return baseSlug;
    }

    const existingProducts = await Product.findAll({
      where: {
        slug: {
          [Op.iLike]: `${baseSlug}-%`,
        },
      },
      attributes: ['slug'],
    });

    const usedNumbers = existingProducts
      .map((product) => {
        const match = product.slug.match(new RegExp(`^${baseSlug}-(\\d+)$`));

        return match ? parseInt(match[1], 10) : null;
      })
      .filter((number) => number !== null);

    let nextNumber = 1;

    while (usedNumbers.includes(nextNumber)) {
      nextNumber++;
    }

    return `${baseSlug}-${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Crea un producto.
   *
   * Las variantes e imágenes son responsabilidad
   * de sus respectivos repositories y services.
   */
  async create(productData) {
    const data = { ...productData };

    if (!data.slug) {
      data.slug = await this.generateUniqueSlug(data.name);
    }

    const existingProduct = await Product.findOne({
      where: {
        slug: data.slug,
      },
    });

    if (existingProduct) {
      throw new ConflictError(`El slug "${data.slug}" ya está en uso`);
    }

    return Product.create({
      ...data,
      status: data.status ?? 'UNPUBLISHED',
    });
  }

  /**
   * Actualiza un producto.
   *
   * El slug es inmutable.
   */
  async update(id, updates) {
    const product = await this.findById(id, {
      includeVariants: false,
      includeImages: false,
    });

    const allowedFields = [
      'name',
      'description',
      'current_price',
      'category_id',
      'status',
    ];

    const filteredUpdates = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    await product.update(filteredUpdates);
    await product.reload();

    return product;
  }

  /**
   * Actualiza el estado de publicación.
   */
  async updateStatus(id, status) {
    if (!['PUBLISHED', 'UNPUBLISHED'].includes(status)) {
      throw new ConflictError(
        `Estado "${status}" no válido. Debe ser PUBLISHED o UNPUBLISHED`,
      );
    }

    const product = await this.findById(id, {
      includeVariants: false,
      includeImages: false,
    });

    await product.update({ status });
    await product.reload();

    return product;
  }

  /**
   * Elimina un producto.
   *
   * La eliminación de variantes e imágenes debe
   * ser coordinada por ProductService.
   */
  async delete(id) {
    const product = await this.findById(id, {
      includeVariants: false,
      includeImages: false,
    });

    await product.destroy();
  }

  /**
   * Verifica si existe un producto por ID.
   */
  async existsById(id) {
    const count = await Product.count({
      where: { id },
    });

    return count > 0;
  }

  /**
   * Verifica si existe un producto por slug.
   */
  async existsBySlug(slug) {
    const count = await Product.count({
      where: { slug },
    });

    return count > 0;
  }

  /**
   * Obtiene la cantidad de productos.
   */
  async count({ status, category_id } = {}) {
    const where = {};

    if (status) {
      where.status = status;
    }

    if (category_id) {
      where.category_id = category_id;
    }

    return Product.count({ where });
  }

  /**
   * Obtiene productos por categoría.
   */
  async findByCategory(categoryId, options = {}) {
    return this.findAll({
      ...options,
      category_id: categoryId,
    });
  }

  /**
   * Obtiene productos destacados.
   *
   * La consulta devuelve productos; la relación con
   * variantes solo se utiliza como criterio de consulta.
   */
  async findFeatured({ limit = 6 } = {}) {
    const products = await Product.findAll({
      where: {
        status: 'PUBLISHED',
      },
      include: [
        {
          model: ProductVariant,
          as: 'variants',
          where: {
            stock: {
              [Op.gt]: 0,
            },
          },
          required: true,
          separate: true,
        },
      ],
      order: [
        ['created_at', 'DESC'],
        ['current_price', 'ASC'],
      ],
      limit,
    });

    return products;
  }
}

export default new ProductRepository();
