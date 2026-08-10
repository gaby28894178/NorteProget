import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Enumeración de estados del pago
 */
const PaymentStatus = DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

/**
 * Modelo de Pago (payments)
 * Almacena los intentos y transacciones de pago asociadas a los pedidos,
 * incluyendo el ID externo de la pasarela de pago y el estado del mismo.
 *
 * Ciclo de vida típico de un pago:
 * PENDING -> APPROVED (pago exitoso)
 * PENDING -> REJECTED (pago rechazado por la pasarela)
 * PENDING -> CANCELLED (pago cancelado por el usuario o por tiempo de expiración)
 *
 * Relaciones:
 * - Pertenece a un pedido (orders.id -> payments.order_id)
 *   Un pedido puede tener múltiples pagos (intentos fallidos + uno aprobado)
 */
class Payment extends Model {}

Payment.init(
  {
    /**
     * Identificador único UUID del pago
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Identificador del pedido asociado a este pago
     * Campo obligatorio, clave foránea hacia orders.id
     */
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },

    /**
     * ID del pago en la pasarela externa (Mercado Pago, Stripe, etc.)
     * Campo opcional, máximo 255 caracteres
     * Se completa cuando la pasarela devuelve el ID de la transacción creada
     * Se utiliza para consultar el estado y gestionar reembolsos
     */
    external_payment_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    /**
     * Estado actual del pago
     * Valores posibles: PENDING | APPROVED | REJECTED | CANCELLED
     * PENDING   = Pago creado, esperando confirmación de la pasarela
     * APPROVED  = Pago aprobado exitosamente
     * REJECTED  = Pago rechazado (fondos insuficientes, tarjeta vencida, etc.)
     * CANCELLED = Pago cancelado (tiempo expirado o cancelación manual)
     */
    status: {
      type: PaymentStatus,
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
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

export default Payment;
