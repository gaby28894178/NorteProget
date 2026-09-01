// src/modules/products/product-image-service.js
import ProductImageRepository from './product-image-repository.js';
import ProductRepository from './product-repository.js';

import cloudinary from '../../core/config/cloudinary.js';

import { NotFoundError, ConflictError } from '../../core/errors/index.js';

class ProductImageService {
  /**
   * Obtiene todas las imágenes de un producto.
   */
  async getProductImages(productId) {
    // Verificar que el producto existe
    const productExists = await ProductRepository.existsById(productId);
    if (!productExists) {
      throw new NotFoundError(`Producto con ID ${productId} no encontrado`);
    }

    return ProductImageRepository.findByProductId(productId);
  }

  /**
   * Obtiene una imagen por ID.
   */
  async getImageById(id) {
    return ProductImageRepository.findById(id);
  }

  /**
   * Obtiene la imagen principal de un producto.
   */
  async getMainImage(productId) {
    return ProductImageRepository.findFirstByProductId(productId);
  }

  /**
   * Sube una imagen a Cloudinary y crea el registro.
   */
  async uploadImage(productId, fileBuffer, options = {}) {
    // Verificar que el producto existe
    const product = await ProductRepository.findById(productId, {
      includeVariants: false,
      includeImages: false,
    });

    // Subir a Cloudinary
    const result = await cloudinary.v2.uploader.upload(
      `data:${fileBuffer.mimetype};base64,${fileBuffer.buffer.toString('base64')}`,
      {
        folder: `products/${productId}`,
        public_id: options.public_id || `product-${Date.now()}`,
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
    );

    // Determinar el display_order
    const displayOrder =
      options.display_order ||
      (await ProductImageRepository.getNextDisplayOrder(productId));

    // Crear el registro
    const image = await ProductImageRepository.create({
      product_id: productId,
      public_id: result.public_id,
      secure_url: result.secure_url,
      display_order: displayOrder,
    });

    return image;
  }

  /**
   * Sube múltiples imágenes a Cloudinary.
   */
  async uploadMultipleImages(productId, files) {
    const images = [];

    for (let i = 0; i < files.length; i++) {
      const image = await this.uploadImage(productId, files[i], {
        display_order: i + 1,
      });
      images.push(image);
    }

    return images;
  }

  /**
   * Actualiza una imagen.
   */
  async updateImage(id, updates) {
    return ProductImageRepository.update(id, updates);
  }

  /**
   * Reemplaza una imagen en Cloudinary.
   */
  async replaceImage(id, fileBuffer, options = {}) {
    const image = await ProductImageRepository.findById(id);

    // Eliminar imagen anterior de Cloudinary
    try {
      await cloudinary.v2.uploader.destroy(image.public_id);
    } catch (error) {
      console.error(`Error eliminando imagen anterior: ${error.message}`);
    }

    // Subir nueva imagen
    const result = await cloudinary.v2.uploader.upload(
      `data:${fileBuffer.mimetype};base64,${fileBuffer.buffer.toString('base64')}`,
      {
        folder: `products/${image.product_id}`,
        public_id: `product-${Date.now()}`,
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
    );

    // Actualizar registro
    return ProductImageRepository.update(id, {
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  }

  /**
   * Actualiza el orden de una imagen.
   */
  async updateDisplayOrder(id, displayOrder) {
    return ProductImageRepository.updateDisplayOrder(id, displayOrder);
  }

  /**
   * Reordena todas las imágenes de un producto.
   */
  async reorderImages(productId, imagesOrder) {
    return ProductImageRepository.reorder(productId, imagesOrder);
  }

  /**
   * Elimina una imagen (de Cloudinary y de la base de datos).
   */
  async deleteImage(id) {
    const image = await ProductImageRepository.findById(id);

    // Eliminar de Cloudinary
    try {
      await cloudinary.v2.uploader.destroy(image.public_id);
    } catch (error) {
      console.error(`Error eliminando imagen de Cloudinary: ${error.message}`);
    }

    // Eliminar de la base de datos
    await ProductImageRepository.delete(id);

    return { message: 'Imagen eliminada correctamente' };
  }

  /**
   * Elimina todas las imágenes de un producto.
   */
  async deleteAllImages(productId) {
    const images = await ProductImageRepository.findByProductId(productId);

    // Eliminar de Cloudinary
    for (const image of images) {
      try {
        await cloudinary.v2.uploader.destroy(image.public_id);
      } catch (error) {
        console.error(
          `Error eliminando imagen ${image.public_id} de Cloudinary: ${error.message}`,
        );
      }
    }

    // Eliminar de la base de datos
    await ProductImageRepository.deleteByProductId(productId);

    return { message: 'Imágenes eliminadas correctamente' };
  }

  /**
   * Obtiene el siguiente display_order disponible.
   */
  async getNextDisplayOrder(productId) {
    return ProductImageRepository.getNextDisplayOrder(productId);
  }

  /**
   * Obtiene la URL segura de una imagen.
   */
  async getSecureUrl(publicId) {
    try {
      const result = await cloudinary.v2.api.resource(publicId);
      return result.secure_url;
    } catch (error) {
      throw new NotFoundError(`Imagen ${publicId} no encontrada en Cloudinary`);
    }
  }

  /**
   * Verifica si existe una imagen por ID.
   */
  async existsById(id) {
    return ProductImageRepository.existsById(id);
  }

  /**
   * Cuenta las imágenes de un producto.
   */
  async countImages(productId) {
    return ProductImageRepository.countByProductId(productId);
  }
}

export default new ProductImageService();
