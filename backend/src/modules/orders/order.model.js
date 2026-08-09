import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Enumeración de estados del pedido
 */
const OrderStatus = DataTypes.ENUM('PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'CANCELLED');

/**
 * Modelo de Pedido (orders)
 * Almacena la información general de los pedidos realizados por los usuarios,
 * incluyendo el monto total y el estado actual del pedido en su ciclo de vida.
 *
 * Ciclo de vida típico de un pedido:
 * PENDING -> PAID -> PROCESSING -> COMPLETED
 *                          \-> CANCELLED (en cualquier momento antes de COMPLETED)
 *
 * Relaciones:
 * - Pertenece a un usuario (users.id -> orders.user_id)
 * - Tiene múltiples ítems (orders.id -> order_items.order_id)
 * - Tiene uno o más pagos (orders.id -> payments.order_id)
 */
class Order extends Model {}

Order.init(
  {
    /**
     * Identificador único UUID del pedido
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Identificador del usuario que realizó el pedido
     * Campo obligatorio, clave foránea hacia users.id
     */
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },

    /**
     * Estado actual del pedido
     * Valores posibles: PENDING | PAID | PROCESSING | COMPLETED | CANCELLED
     * PENDING     = Pedido creado, esperando pago
     * PAID        = Pago aprobado
     * PROCESSING  = Pedido en preparación para envío/retiro
     * COMPLETED   = Pedido entregado/finalizado exitosamente
     * CANCELLED   = Pedido cancelado (reembolso si corresponde)
     */
    status: {
      type: OrderStatus,
      allowNull: false,
    },

    /**
     * Monto total del pedido
     * Campo obligatorio, decimal con 10 dígitos totales y 2 decimales
     * Es el resultado de sumar (precio_unitario * cantidad) de todos los ítems
     * Se almacena para preservar el valor histórico aunque los precios cambien
     */
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
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
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Order;
