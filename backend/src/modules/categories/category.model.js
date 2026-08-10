import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Modelo de Categoría (categories)
 * Almacena las categorías de productos disponibles en el catálogo,
 * permitiendo organizar los productos por tipo o clasificación.
 */
class Category extends Model {}

Category.init(
  {
    /**
     * Identificador único UUID de la categoría
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Nombre de la categoría
     * Campo obligatorio, máximo 100 caracteres
     */
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    /**
     * Slug URL-friendly de la categoría
     * Campo obligatorio, único en el sistema, máximo 120 caracteres
     * Utilizado para URLs amigables (ej: /categorias/ropa-hombre)
     */
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },

    /**
     * Indica si la categoría está activa o no
     * Valor por defecto: true
     */
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Category;
