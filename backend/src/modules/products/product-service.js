import ProductRepository from './product-repository.js';
import ProductVariantRepository from './product-variant-repository.js';
import ProductImageRepository from './product-image-repository.js';

import cloudinary from '../../core/config/cloudinary.js';
import sequelize from '../../database/database.js';

import { NotFoundError, ConflictError } from '../../core/errors/index.js';

class ProductService {
  /**
   * Obtiene todos los productos con filtros.
   */
  async getAllProducts(filters) {
    return ProductRepository.findAll(filters);
  }

  /**
   * Obtiene productos publicados para el catálogo.
   */
  async getPublishedProducts({ category_id, search, limit, page }) {
    return ProductRepository.findPublished({
      category_id,
      search,
      limit,
      page,
    });
  }

  /**
   * Obtiene un producto por ID.
   */
  async getProductById(id) {
    return ProductRepository.findById(id);
  }

  /**
   * Obtiene un producto por slug.
   */
  async getProductBySlug(slug) {
    return ProductRepository.findBySlug(slug);
  }

  /**
   * Crea un producto con sus variantes e imágenes.
   */
  async createProduct(productData, variantsData = [], imagesData = []) {
    const result = await sequelize.transaction(async (transaction) => {
      // 1. Crear el producto
      const product = await ProductRepository.create(
        {
          ...productData,
          status: productData.status ?? 'UNPUBLISHED',
        },
        { transaction },
      );

      // 2. Crear variantes
      const variants = [];
      for (const variantData of variantsData) {
        const variant = await ProductVariantRepository.create(
          {
            ...variantData,
            product_id: product.id,
          },
          { transaction },
        );
        variants.push(variant);
      }

      // 3. Crear imágenes
      const images = [];
      for (let i = 0; i < imagesData.length; i++) {
        const imageData = imagesData[i];
        const image = await ProductImageRepository.create(
          {
            product_id: product.id,
            public_id: imageData.public_id,
            secure_url: imageData.secure_url,
            display_order: imageData.display_order ?? i + 1,
          },
          { transaction },
        );
        images.push(image);
      }

      // 4. Si hay variantes, establecer la primera como default
      if (variants.length > 0) {
        await ProductVariantRepository.setDefaultVariant(
          product.id,
          variants[0].id,
          { transaction },
        );
      }

      // 5. Recargar el producto con todas las relaciones
      const fullProduct = await ProductRepository.findById(product.id, {
        includeVariants: true,
        includeImages: true,
        transaction,
      });

      return fullProduct;
    });

    return result;
  }

  /**
   * Actualiza un producto.
   *
   * El slug es inmutable y no se puede cambiar.
   */
  async updateProduct(id, updates) {
    const product = await ProductRepository.update(id, updates);
    return product;
  }

  /**
   * Actualiza el estado del producto.
   */
  async updateProductStatus(id, status) {
    return ProductRepository.updateStatus(id, status);
  }

  /**
   * Elimina un producto completo (con variantes e imágenes).
   */
  async deleteProduct(id) {
    // Obtener el producto completo para tener acceso a las imágenes
    const product = await ProductRepository.findById(id, {
      includeVariants: true,
      includeImages: true,
    });

    await sequelize.transaction(async (transaction) => {
      // 1. Eliminar imágenes de Cloudinary
      for (const image of product.images) {
        try {
          await cloudinary.v2.uploader.destroy(image.public_id);
        } catch (error) {
          console.error(
            `Error eliminando imagen de Cloudinary: ${error.message}`,
          );
        }
      }

      // 2. Eliminar registros en la base de datos
      await ProductRepository.delete(id, { transaction });
    });

    return { message: 'Producto eliminado correctamente' };
  }

  /**
   * Obtiene productos por categoría.
   */
  async getProductsByCategory(categoryId, options = {}) {
    return ProductRepository.findByCategory(categoryId, options);
  }

  /**
   * Genera un slug único.
   */
  async generateUniqueSlug(name) {
    return ProductRepository.generateUniqueSlug(name);
  }

  /**
   * Actualiza el precio de un producto.
   */
  async updateProductPrice(id, currentPrice) {
    if (currentPrice < 0) {
      throw new ConflictError('El precio no puede ser negativo');
    }

    const product = await ProductRepository.update(id, {
      current_price: currentPrice,
    });

    return product;
  }
}

export default new ProductService();
