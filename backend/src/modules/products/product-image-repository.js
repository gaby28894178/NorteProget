import { Op } from 'sequelize';

import sequelize from '../../database/database.js';

import ProductImage from './product-image-model.js';
import Product from './product-model.js';

import { NotFoundError, ConflictError } from '../../core/errors/index.js';

class ProductImageRepository {
  /**
   * Obtiene una imagen por ID.
   */
  async findById(id) {
    const image = await ProductImage.findByPk(id);

    if (!image) {
      throw new NotFoundError(`Imagen con ID ${id} no encontrada`);
    }

    return image;
  }

  /**
   * Obtiene todas las imágenes de un producto.
   */
  async findByProductId(productId, { includeProduct = false } = {}) {
    const include = includeProduct ? [{ model: Product, as: 'product' }] : [];

    return ProductImage.findAll({
      where: {
        product_id: productId,
      },
      include,
      order: [['display_order', 'ASC']],
    });
  }

  /**
   * Obtiene una imagen por su posición.
   */
  async findByDisplayOrder(productId, displayOrder) {
    const image = await ProductImage.findOne({
      where: {
        product_id: productId,
        display_order: displayOrder,
      },
    });

    if (!image) {
      throw new NotFoundError(
        `No se encontró una imagen en la posición ${displayOrder} del producto ${productId}`,
      );
    }

    return image;
  }

  /**
   * Obtiene la primera imagen del producto.
   */
  async findFirstByProductId(productId) {
    return ProductImage.findOne({
      where: {
        product_id: productId,
      },
      order: [['display_order', 'ASC']],
    });
  }

  /**
   * Crea una imagen.
   *
   * Cloudinary se gestiona en el Service.
   */
  async create(imageData) {
    const product = await Product.findByPk(imageData.product_id);

    if (!product) {
      throw new NotFoundError(
        `Producto con ID ${imageData.product_id} no encontrado`,
      );
    }

    const existingImage = await ProductImage.findOne({
      where: {
        product_id: imageData.product_id,
        display_order: imageData.display_order,
      },
    });

    if (existingImage) {
      throw new ConflictError(
        `Ya existe una imagen en la posición ${imageData.display_order} para el producto ${imageData.product_id}`,
      );
    }

    return ProductImage.create(imageData);
  }

  /**
   * Crea múltiples imágenes.
   */
  async createMany(productId, imagesData) {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw new NotFoundError(`Producto con ID ${productId} no encontrado`);
    }

    const createdImages = [];

    for (const imageData of imagesData) {
      const image = await this.create({
        ...imageData,
        product_id: productId,
      });

      createdImages.push(image);
    }

    return createdImages;
  }

  /**
   * Actualiza una imagen.
   *
   * No permite modificar product_id.
   */
  async update(id, updates) {
    const image = await this.findById(id);

    const allowedFields = ['public_id', 'secure_url', 'display_order'];

    const filteredUpdates = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    if (
      updates.display_order !== undefined &&
      updates.display_order !== image.display_order
    ) {
      const existingImage = await ProductImage.findOne({
        where: {
          product_id: image.product_id,
          display_order: updates.display_order,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (existingImage) {
        throw new ConflictError(
          `Ya existe una imagen en la posición ${updates.display_order} para el producto ${image.product_id}`,
        );
      }
    }

    await image.update(filteredUpdates);
    await image.reload();

    return image;
  }

  /**
   * Actualiza únicamente el orden.
   */
  async updateDisplayOrder(id, displayOrder) {
    return this.update(id, {
      display_order: displayOrder,
    });
  }

  /**
   * Elimina una imagen de la base de datos.
   *
   * La eliminación en Cloudinary es responsabilidad del Service.
   */
  async delete(id) {
    const image = await this.findById(id);

    await image.destroy();
  }

  /**
   * Elimina todas las imágenes de un producto.
   *
   * Cloudinary debe ser gestionado por el Service.
   */
  async deleteByProductId(productId) {
    return ProductImage.destroy({
      where: {
        product_id: productId,
      },
    });
  }

  /**
   * Verifica existencia por ID.
   */
  async existsById(id) {
    const count = await ProductImage.count({
      where: { id },
    });

    return count > 0;
  }

  /**
   * Cuenta las imágenes de un producto.
   */
  async countByProductId(productId) {
    return ProductImage.count({
      where: {
        product_id: productId,
      },
    });
  }

  /**
   * Obtiene el siguiente display_order.
   */
  async getNextDisplayOrder(productId) {
    const lastImage = await ProductImage.findOne({
      where: {
        product_id: productId,
      },
      order: [['display_order', 'DESC']],
    });

    return lastImage ? lastImage.display_order + 1 : 1;
  }

  /**
   * Reordena las imágenes de un producto.
   *
   * Utiliza posiciones temporales para evitar
   * conflictos con el índice UNIQUE:
   *
   * product_id + display_order
   */
  async reorder(productId, imagesOrder) {
    if (!Array.isArray(imagesOrder) || imagesOrder.length === 0) {
      return this.findByProductId(productId);
    }

    const imageIds = imagesOrder.map((image) => image.id);

    const displayOrders = imagesOrder.map((image) => image.display_order);

    // Evitar posiciones duplicadas
    if (new Set(displayOrders).size !== displayOrders.length) {
      throw new ConflictError('No puede haber posiciones de imagen duplicadas');
    }

    const images = await ProductImage.findAll({
      where: {
        id: {
          [Op.in]: imageIds,
        },
        product_id: productId,
      },
    });

    if (images.length !== imageIds.length) {
      throw new NotFoundError(
        'Una o más imágenes no pertenecen al producto indicado',
      );
    }

    await sequelize.transaction(async (transaction) => {
      // Paso 1: mover temporalmente todas las posiciones.
      await Promise.all(
        images.map((image, index) =>
          image.update(
            {
              display_order: -(index + 1),
            },
            { transaction },
          ),
        ),
      );

      // Paso 2: asignar las posiciones definitivas.
      for (const imageOrder of imagesOrder) {
        await ProductImage.update(
          {
            display_order: imageOrder.display_order,
          },
          {
            where: {
              id: imageOrder.id,
              product_id: productId,
            },
            transaction,
          },
        );
      }
    });

    return this.findByProductId(productId);
  }
}

export default new ProductImageRepository();
