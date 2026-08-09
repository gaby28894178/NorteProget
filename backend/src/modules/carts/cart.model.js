import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Modelo de Carrito (carts)
 * Almacena los carritos de compra, tanto de usuarios anónimos (identificados
 * por session_id) como de usuarios autenticados (identificados por user_id).
 *
 * Regla de negocio:
 * - Al menos uno de los campos user_id o session_id debe tener valor.
 *   Nunca ambos campos pueden ser NULL al mismo tiempo.
 * - Es válido que ambos valores coexistan (transición entre sesión anónima y autenticada).
 *
 * Relaciones:
 * - Pertenece opcionalmente a un usuario (users.id -> carts.user_id)
 * - Tiene múltiples ítems (carts.id -> cart_items.cart_id)
 */
class Cart extends Model {}

Cart.init(
  {
    /**
     * Identificador único UUID del carrito
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Identificador del usuario autenticado propietario del carrito
     * Campo opcional, clave foránea hacia users.id
     * Obligatorio cuando el usuario inicia sesión y se asocia el carrito
     */
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },

    /**
     * Identificador de sesión para usuarios anónimos
     * Campo opcional, único en el sistema, máximo 255 caracteres
     * Obligatorio cuando el usuario navega sin autenticar
     * Permite mantener el carrito entre páginas sin login
     */
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
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
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    validate: {
      /**
       * Validación personalizada: garantiza que al menos uno de los campos
       * (user_id o session_id) tenga un valor, evitando que ambos sean NULL.
       */
      atLeastOneIdentifier() {
        if (!this.user_id && !this.session_id) {
          throw new Error('El carrito debe tener al menos user_id o session_id definidos');
        }
      },
    },
  }
);

export default Cart;
