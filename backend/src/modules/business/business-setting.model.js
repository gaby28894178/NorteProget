import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Modelo de Configuración del Negocio (business_settings)
 * Almacena la información de contacto y configuración general del negocio,
 * como el número de WhatsApp y el mensaje predeterminado para las consultas.
 *
 * Nota: En una implementación real, esta tabla tendría generalmente un único
 * registro (singleton) que representa la configuración del negocio.
 */
class BusinessSetting extends Model {}

BusinessSetting.init(
  {
    /**
     * Identificador único UUID de la configuración
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Número de teléfono de WhatsApp del negocio
     * Campo obligatorio, máximo 30 caracteres
     * Formato recomendado: código de país + número sin espacios ni guiones
     * Ejemplo: 5491112345678 (Argentina)
     */
    whatsapp_number: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    /**
     * Mensaje predeterminado para las consultas de WhatsApp
     * Campo obligatorio, texto largo sin límite
     * Se utiliza como texto inicial cuando el usuario hace clic en el botón de WhatsApp
     * Puede incluir placeholders para completar dinámicamente en el frontend
     */
    default_message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BusinessSetting',
    tableName: 'business_settings',
    timestamps: false,
  }
);

export default BusinessSetting;
