import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Modelo de Imagen de Producto (product_images)
 * Almacena las imágenes asociadas a cada producto, incluyendo sus URLs
 * en el servicio de almacenamiento en la nube (Cloudinary) y el orden
 * de visualización en la galería del producto.
 *
 * Restricciones de integridad:
 * - El orden de visualización de las imágenes debe ser único para cada producto.
 *   Índice único compuesto: (product_id, display_order)
 *
 * Relaciones:
 * - Pertenece a un producto (products.id -> product_images.product_id)
 */
class ProductImage extends Model {}

ProductImage.init(
  {
    /**
     * Identificador único UUID de la imagen
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Identificador del producto al que pertenece la imagen
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
     * ID público de la imagen en Cloudinary
     * Campo obligatorio, máximo 255 caracteres
     * Utilizado para gestionar la imagen en Cloudinary (eliminar, transformar, etc.)
     */
    public_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    /**
     * URL segura (HTTPS) de la imagen en Cloudinary
     * Campo obligatorio, máximo 500 caracteres
     * Utilizada para mostrar la imagen en la aplicación frontend
     */
    secure_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    /**
     * Número de orden para la visualización de las imágenes
     * Campo obligatorio, entero
     * Valores menores aparecen primero en la galería (ascendente)
     * Restricción: único por producto
     */
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    /**
     * Fecha y hora de creación del registro
     * Gestionado automáticamente por Sequelize
     */
    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'ProductImage',
    tableName: 'product_images',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['product_id', 'display_order'],
      },
    ],
  }
);

export default ProductImage;
