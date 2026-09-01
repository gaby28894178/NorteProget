// src/modules/products/product-variant-service.js
import ProductVariantRepository from './product-variant-repository.js';
import ProductRepository from './product-repository.js';

import { NotFoundError, ConflictError } from '../../core/errors/index.js';

class ProductVariantService {
  /**
   * Obtiene todas las variantes de un producto.
   */
  async getProductVariants(productId) {
    // Verificar que el producto existe
    const productExists = await ProductRepository.existsById(productId);
    if (!productExists) {
      throw new NotFoundError(`Producto con ID ${productId} no encontrado`);
    }

    return ProductVariantRepository.findByProductId(productId);
  }

  /**
   * Obtiene una variante por ID.
   */
  async getVariantById(id) {
    return ProductVariantRepository.findById(id);
  }

  /**
   * Obtiene la variante por defecto de un producto.
   */
  async getDefaultVariant(productId) {
    const variant = await ProductVariantRepository.getDefaultVariant(productId);

    if (!variant) {
      // Si no hay variante por defecto, tomar la primera
      const variants =
        await ProductVariantRepository.findByProductId(productId);
      if (variants.length > 0) {
        // Establecer la primera como default
        return ProductVariantRepository.setDefaultVariant(
          productId,
          variants[0].id,
        );
      }
      return null;
    }

    return variant;
  }

  /**
   * Crea una variante.
   */
  async createVariant(productId, variantData) {
    // Verificar que el producto existe
    const product = await ProductRepository.findById(productId, {
      includeVariants: false,
      includeImages: false,
    });

    // Generar SKU si no viene
    let sku = variantData.sku;
    if (!sku) {
      sku = await ProductVariantRepository.generateUniqueSku(
        product.name,
        variantData.size,
        variantData.color,
      );
    }

    const variant = await ProductVariantRepository.create({
      ...variantData,
      product_id: productId,
      sku,
      stock: variantData.stock ?? 0,
      is_default: variantData.is_default ?? false,
    });

    // Si es la primera variante del producto, establecer como default
    const variantCount =
      await ProductVariantRepository.countByProductId(productId);
    if (variantCount === 1) {
      await ProductVariantRepository.setDefaultVariant(productId, variant.id);
    }

    return variant;
  }

  /**
   * Crea múltiples variantes.
   */
  async createManyVariants(productId, variantsData) {
    // Verificar que el producto existe
    const productExists = await ProductRepository.existsById(productId);
    if (!productExists) {
      throw new NotFoundError(`Producto con ID ${productId} no encontrado`);
    }

    const variants = await ProductVariantRepository.createMany(
      productId,
      variantsData,
    );

    return variants;
  }

  /**
   * Actualiza una variante.
   */
  async updateVariant(id, updates) {
    const variant = await ProductVariantRepository.update(id, updates);
    return variant;
  }

  /**
   * Establece una variante como predeterminada.
   */
  async setDefaultVariant(productId, variantId) {
    // Verificar que la variante pertenece al producto
    const variant = await ProductVariantRepository.findById(variantId);
    if (variant.product_id !== productId) {
      throw new ConflictError(
        `La variante ${variantId} no pertenece al producto ${productId}`,
      );
    }

    return ProductVariantRepository.setDefaultVariant(productId, variantId);
  }

  /**
   * Actualiza el stock de una variante.
   */
  async updateStock(id, newStock) {
    if (newStock < 0) {
      throw new ConflictError('El stock no puede ser negativo');
    }

    return ProductVariantRepository.updateStock(id, newStock);
  }

  /**
   * Ajusta el stock sumando o restando.
   */
  async adjustStock(id, adjustment) {
    return ProductVariantRepository.adjustStock(id, adjustment);
  }

  /**
   * Verifica si hay stock suficiente.
   */
  async checkStock(id, quantity = 1) {
    return ProductVariantRepository.hasStock(id, quantity);
  }

  /**
   * Elimina una variante.
   */
  async deleteVariant(id) {
    const variant = await ProductVariantRepository.findById(id);

    await ProductVariantRepository.delete(id);

    // Si la variante eliminada era la default, establecer otra
    if (variant.is_default) {
      const variants = await ProductVariantRepository.findByProductId(
        variant.product_id,
      );
      if (variants.length > 0) {
        await ProductVariantRepository.setDefaultVariant(
          variant.product_id,
          variants[0].id,
        );
      }
    }

    return { message: 'Variante eliminada correctamente' };
  }

  /**
   * Obtiene variantes con stock disponible.
   */
  async getAvailableVariants(productId) {
    return ProductVariantRepository.findWithStock(productId);
  }

  /**
   * Obtiene variantes con bajo stock.
   */
  async getLowStockVariants({ threshold, limit, productId }) {
    return ProductVariantRepository.findLowStock({
      threshold: threshold || 5,
      limit: limit || 10,
      productId,
    });
  }

  /**
   * Obtiene el stock total de un producto.
   */
  async getTotalStock(productId) {
    return ProductVariantRepository.getTotalStock(productId);
  }

  /**
   * Busca variantes por SKU.
   */
  async searchBySku(sku) {
    return ProductVariantRepository.findBySkuPartial(sku);
  }

  /**
   * Valida combinación única.
   */
  async validateCombination(productId, size, color, excludeId = null) {
    return ProductVariantRepository.validateUniqueCombination(
      productId,
      size,
      color,
      excludeId,
    );
  }

  /**
   * Verifica si existe una variante por ID.
   */
  async existsById(id) {
    return ProductVariantRepository.existsById(id);
  }

  /**
   * Cuenta variantes de un producto.
   */
  async countByProductId(productId) {
    return ProductVariantRepository.countByProductId(productId);
  }

  /**
   * Clona variantes de un producto a otro.
   */
  async cloneVariants(fromProductId, toProductId) {
    return ProductVariantRepository.cloneVariants(fromProductId, toProductId);
  }
}

export default new ProductVariantService();
