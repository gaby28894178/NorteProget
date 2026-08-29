import { Op } from 'sequelize';

import ProductVariant from './product-variant-model.js';
import Product from './product-model.js';

import { NotFoundError, ConflictError } from '../../core/errors/index.js';

class ProductVariantRepository {
  /**
   * Obtiene una variante por ID.
   */
  async findById(id) {
    const variant = await ProductVariant.findByPk(id);

    if (!variant) {
      throw new NotFoundError(`Variante con ID ${id} no encontrada`);
    }

    return variant;
  }

  /**
   * Obtiene todas las variantes de un producto.
   */
  async findByProductId(productId, { includeProduct = false } = {}) {
    const include = includeProduct ? [{ model: Product, as: 'product' }] : [];

    return ProductVariant.findAll({
      where: {
        product_id: productId,
      },
      include,
      order: [['created_at', 'ASC']],
    });
  }

  /**
   * Obtiene la variante por defecto.
   */
  async getDefaultVariant(productId) {
    return ProductVariant.findOne({
      where: {
        product_id: productId,
        is_default: true,
      },
    });
  }

  /**
   * Obtiene variantes con stock disponible.
   */
  async findWithStock(productId) {
    return ProductVariant.findAll({
      where: {
        product_id: productId,
        stock: {
          [Op.gt]: 0,
        },
      },
      order: [['stock', 'DESC']],
    });
  }

  /**
   * Obtiene variantes con bajo stock.
   */
  async findLowStock({ threshold = 5, limit = 10, productId = null } = {}) {
    const where = {
      stock: {
        [Op.lte]: threshold,
      },
    };

    if (productId) {
      where.product_id = productId;
    }

    return ProductVariant.findAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          where: {
            status: 'PUBLISHED',
          },
          required: true,
        },
      ],
      limit,
      order: [['stock', 'ASC']],
    });
  }

  /**
   * Genera un SKU único.
   */
  async generateUniqueSku(productName, size = '', color = '') {
    const cleanProductName = productName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 3);

    const cleanSize = size
      ? size
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '')
          .substring(0, 3)
      : '';

    const cleanColor = color
      ? color
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '')
          .substring(0, 3)
      : '';

    const baseSku = [cleanProductName, cleanSize, cleanColor]
      .filter(Boolean)
      .join('-');

    if (!baseSku) {
      return `VAR-${Date.now().toString(36).toUpperCase()}`;
    }

    const existingVariants = await ProductVariant.findAll({
      where: {
        sku: {
          [Op.iLike]: `${baseSku}-%`,
        },
      },
      attributes: ['sku'],
    });

    const usedNumbers = existingVariants
      .map((variant) => {
        const match = variant.sku.match(new RegExp(`^${baseSku}-(\\d+)$`));

        return match ? parseInt(match[1], 10) : null;
      })
      .filter((number) => number !== null);

    let nextNumber = 1;

    while (usedNumbers.includes(nextNumber)) {
      nextNumber++;
    }

    return `${baseSku}-${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Valida combinación única producto + talla + color.
   */
  async validateUniqueCombination(productId, size, color, excludeId = null) {
    const where = {
      product_id: productId,
      size: size ?? null,
      color: color ?? null,
    };

    if (excludeId) {
      where.id = {
        [Op.ne]: excludeId,
      };
    }

    const existing = await ProductVariant.findOne({ where });

    if (existing) {
      throw new ConflictError(
        `Ya existe una variante con la combinación: producto ${productId}, talla ${size || 'N/A'}, color ${color || 'N/A'}`,
      );
    }
  }

  /**
   * Crea una variante.
   */
  async create(variantData) {
    const product = await Product.findByPk(variantData.product_id);

    if (!product) {
      throw new NotFoundError(
        `Producto con ID ${variantData.product_id} no encontrado`,
      );
    }

    const sku =
      variantData.sku ||
      (await this.generateUniqueSku(
        product.name,
        variantData.size,
        variantData.color,
      ));

    const existingSku = await ProductVariant.findOne({
      where: { sku },
    });

    if (existingSku) {
      throw new ConflictError(`El SKU "${sku}" ya está en uso`);
    }

    await this.validateUniqueCombination(
      variantData.product_id,
      variantData.size,
      variantData.color,
    );

    const variant = await ProductVariant.create({
      ...variantData,
      sku,
      stock: variantData.stock ?? 0,
      is_default: variantData.is_default ?? false,
    });

    if (variant.is_default) {
      await ProductVariant.update(
        { is_default: false },
        {
          where: {
            product_id: variant.product_id,
            id: {
              [Op.ne]: variant.id,
            },
          },
        },
      );
    }

    return variant;
  }

  /**
   * Crea múltiples variantes.
   */
  async createMany(productId, variantsData) {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new NotFoundError(`Producto con ID ${productId} no encontrado`);
    }

    const createdVariants = [];

    for (const variantData of variantsData) {
      const variant = await this.create({
        ...variantData,
        product_id: productId,
      });

      createdVariants.push(variant);
    }

    const hasDefault = createdVariants.some((variant) => variant.is_default);

    if (!hasDefault && createdVariants.length > 0) {
      await this.setDefaultVariant(productId, createdVariants[0].id);
    }

    return createdVariants;
  }

  /**
   * Actualiza una variante.
   */
  async update(id, updates) {
    const variant = await this.findById(id);

    const allowedFields = ['size', 'color', 'stock', 'is_default', 'sku'];

    const filteredUpdates = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    if (updates.size !== undefined || updates.color !== undefined) {
      await this.validateUniqueCombination(
        variant.product_id,
        updates.size !== undefined ? updates.size : variant.size,
        updates.color !== undefined ? updates.color : variant.color,
        id,
      );
    }

    if (updates.sku !== undefined && updates.sku !== variant.sku) {
      const existingSku = await ProductVariant.findOne({
        where: {
          sku: updates.sku,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (existingSku) {
        throw new ConflictError(`El SKU "${updates.sku}" ya está en uso`);
      }
    }

    await variant.update(filteredUpdates);

    if (variant.is_default) {
      await ProductVariant.update(
        { is_default: false },
        {
          where: {
            product_id: variant.product_id,
            id: {
              [Op.ne]: variant.id,
            },
          },
        },
      );
    }

    await variant.reload();

    return variant;
  }

  /**
   * Establece una variante como predeterminada.
   */
  async setDefaultVariant(productId, variantId) {
    const variant = await ProductVariant.findOne({
      where: {
        id: variantId,
        product_id: productId,
      },
    });

    if (!variant) {
      throw new NotFoundError(
        `Variante ${variantId} no pertenece al producto ${productId}`,
      );
    }

    await ProductVariant.update(
      { is_default: false },
      {
        where: {
          product_id: productId,
        },
      },
    );

    await variant.update({
      is_default: true,
    });

    await variant.reload();

    return variant;
  }

  /**
   * Actualiza el stock.
   */
  async updateStock(id, newStock) {
    if (newStock < 0) {
      throw new ConflictError('El stock no puede ser negativo');
    }

    const variant = await this.findById(id);

    await variant.update({
      stock: newStock,
    });

    await variant.reload();

    return variant;
  }

  /**
   * Ajusta el stock sumando o restando.
   */
  async adjustStock(id, adjustment) {
    const variant = await this.findById(id);

    const newStock = variant.stock + adjustment;

    if (newStock < 0) {
      throw new ConflictError(
        `Stock insuficiente. Stock actual: ${variant.stock}, ajuste solicitado: ${adjustment}`,
      );
    }

    await variant.update({
      stock: newStock,
    });

    await variant.reload();

    return variant;
  }

  /**
   * Verifica si hay stock suficiente.
   */
  async hasStock(id, quantity = 1) {
    const variant = await this.findById(id);

    return variant.stock >= quantity;
  }

  /**
   * Elimina una variante.
   */
  async delete(id) {
    const variant = await this.findById(id);

    await variant.destroy();
  }

  /**
   * Elimina todas las variantes de un producto.
   */
  async deleteByProductId(productId) {
    return ProductVariant.destroy({
      where: {
        product_id: productId,
      },
    });
  }

  /**
   * Verifica existencia por ID.
   */
  async existsById(id) {
    const count = await ProductVariant.count({
      where: { id },
    });

    return count > 0;
  }

  /**
   * Cuenta las variantes de un producto.
   */
  async countByProductId(productId) {
    return ProductVariant.count({
      where: {
        product_id: productId,
      },
    });
  }

  /**
   * Obtiene el stock total del producto.
   */
  async getTotalStock(productId) {
    const result = await ProductVariant.sum('stock', {
      where: {
        product_id: productId,
      },
    });

    return result || 0;
  }

  /**
   * Busca variantes por SKU parcial.
   */
  async findBySkuPartial(skuPartial) {
    return ProductVariant.findAll({
      where: {
        sku: {
          [Op.iLike]: `%${skuPartial}%`,
        },
      },
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    });
  }

  /**
   * Clona las variantes de un producto a otro.
   */
  async cloneVariants(fromProductId, toProductId) {
    const toProduct = await Product.findByPk(toProductId);

    if (!toProduct) {
      throw new NotFoundError(`Producto destino ${toProductId} no encontrado`);
    }

    const sourceVariants = await this.findByProductId(fromProductId);

    if (sourceVariants.length === 0) {
      return [];
    }

    const clonedVariants = [];

    for (const sourceVariant of sourceVariants) {
      const variant = await this.create({
        product_id: toProductId,
        size: sourceVariant.size,
        color: sourceVariant.color,
        stock: 0,
        is_default: sourceVariant.is_default,
      });

      clonedVariants.push(variant);
    }

    return clonedVariants;
  }
}

export default new ProductVariantRepository();
