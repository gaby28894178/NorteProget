import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Modelo de Pregunta Frecuente (faqs)
 * Almacena las preguntas y respuestas frecuentes mostradas en la sección
 * de ayuda del sitio web, con un orden de visualización configurable.
 */
class FAQ extends Model {}

FAQ.init(
  {
    /**
     * Identificador único UUID de la pregunta frecuente
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Pregunta del usuario
     * Campo obligatorio, texto largo sin límite
     */
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    /**
     * Respuesta a la pregunta
     * Campo obligatorio, texto largo sin límite
     */
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    /**
     * Número de orden para la visualización de las preguntas
     * Campo obligatorio, entero
     * Valores menores aparecen primero en la lista (ascendente)
     */
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    /**
     * Indica si la pregunta frecuente está activa o no
     * Las preguntas inactivas no se muestran en el sitio
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
    modelName: 'FAQ',
    tableName: 'faqs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default FAQ;
