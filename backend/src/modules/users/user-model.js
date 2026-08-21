import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Enumeración de roles de usuario
 */
const UserRole = DataTypes.ENUM('ADMIN', 'CUSTOMER');

/**
 * Modelo de Usuario (users)
 * Almacena la información de los usuarios del sistema (administradores y clientes),
 * incluyendo credenciales de acceso y estado de activación.
 */
class User extends Model {}

User.init(
  {
    /**
     * Identificador único UUID del usuario
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Nombre completo del usuario
     * Campo obligatorio, máximo 150 caracteres
     */
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    /**
     * Correo electrónico del usuario
     * Campo obligatorio, único en el sistema, máximo 150 caracteres
     */
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    /**
     * Hash de la contraseña del usuario
     * Almacenado de forma segura (nunca en texto plano), máximo 255 caracteres
     */
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    /**
     * Rol del usuario en el sistema
     * Valores posibles: ADMIN | CUSTOMER
     */
    role: {
      type: UserRole,
      allowNull: false,
    },

    /**
     * Indica si el usuario está activo o no
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
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default User;
