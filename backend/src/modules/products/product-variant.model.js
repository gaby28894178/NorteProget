import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Modelo de Variante de Producto (product_variants)
 * Almacena las distintas combinaciones de talla y color de un producto,
 * cada una con su propio SKU, stock y bandera de variante por defecto.
 *
 * Restricciones de integridad:
 * - Un producto no puede tener dos variantes con la misma combinación de talla y color.
 *   Índice único compuesto: (product_id, size, color)
 *
 * Relaciones:
 * - Pertenece a un producto (products.id -> product_variants.product_id)
 * - Es referenciado por ítems del carrito (product_variants.id -> cart_items.product_variant_id)
 * - Es referenciado por ítems del pedido (product_variants.id -> order_items.product_variant_id)
 */
class ProductVariant extends Model {}

ProductVariant.init(
  {
    /**
     * Identificador único UUID de la variante
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Identificador del producto al que pertenece la variante
     * Campo obligatorio, clave foránea hacia products.id
     */
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },

    /**
     * Stock Keeping Unit (SKU) de la variante
     * Campo obligatorio, único en el sistema, máximo 100 caracteres
     * Código interno para identificar la variante de producto en inventario
     */
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    /**
     * Talla de la variante
     * Campo opcional, máximo 30 caracteres
     * Ejemplos: S, M, L, XL, 42, 43
     */
    size: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    /**
     * Color de la variante
     * Campo opcional, máximo 50 caracteres
     * Ejemplos: Negro, Azul, Rojo
     */
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    /**
     * Cantidad de unidades disponibles en stock
     * Campo obligatorio, valor por defecto: 0
     */
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    /**
     * Indica si esta es la variante por defecto del producto
     * Utilizada para la pre-selección en la vista del producto
     * Valor por defecto: false
     */
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'ProductVariant',
    tableName: 'product_variants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['product_id', 'size', 'color'],
      },
    ],
  }
);

export default ProductVariant;
