import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Enumeración de estados de producto
 */
const ProductStatus = DataTypes.ENUM('PUBLISHED', 'UNPUBLISHED');

/**
 * Modelo de Producto (products)
 * Almacena la información principal de los productos del catálogo,
 * incluyendo su categoría, descripción, precio actual y estado de publicación.
 *
 * Relaciones:
 * - Pertenece a una categoría (categories.id -> products.category_id)
 * - Tiene múltiples variantes (products.id -> product_variants.product_id)
 * - Tiene múltiples imágenes (products.id -> product_images.product_id)
 */
class Product extends Model {}

Product.init(
  {
    /**
     * Identificador único UUID del producto
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Identificador de la categoría a la que pertenece el producto
     * Campo obligatorio, clave foránea hacia categories.id
     */
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },

    /**
     * Nombre del producto
     * Campo obligatorio, máximo 150 caracteres
     */
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    /**
     * Slug URL-friendly del producto
     * Campo obligatorio, único en el sistema, máximo 180 caracteres
     * Utilizado para URLs amigables (ej: /productos/jean-azul-slim)
     */
    slug: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
    },

    /**
     * Descripción detallada del producto
     * Campo opcional, texto largo sin límite
     */
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    /**
     * Precio actual del producto
     * Campo obligatorio, decimal con 10 dígitos totales y 2 decimales
     * Ejemplo: 1499.99
     */
    current_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    /**
     * Estado de publicación del producto
     * Valores posibles: PUBLISHED | UNPUBLISHED
     * PUBLISHED = visible en el catálogo
     * UNPUBLISHED = oculto del catálogo
     */
    status: {
      type: ProductStatus,
      allowNull: false,
    },

    /**
     * Fecha y hora de creación del registro
     * Gestionado automáticamente por Sequelize
     */
    created_at: {
      type: DataTypes.DATE,
    },

    /**
     * Fecha y hora de última actualización del registro
     * Gestionado automáticamente por Sequelize
     */
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Product;
