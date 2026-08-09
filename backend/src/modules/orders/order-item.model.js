import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Modelo de Ítem del Pedido (order_items)
 * Almacena el detalle de cada variante de producto incluida en un pedido,
 * incluyendo la cantidad comprada y el precio al momento de la compra.
 *
 * Restricciones de integridad:
 * - Un pedido no puede tener la misma variante repetida en múltiples registros.
 *   Cada variante debe aparecer una única vez dentro del pedido, almacenando
 *   la cantidad correspondiente.
 *   Índice único compuesto: (order_id, product_variant_id)
 *
 * Nota sobre el precio:
 * Se almacena purchase_price para preservar el precio histórico en el momento
 * de la compra, ya que los precios actuales de los productos pueden cambiar
 * con el tiempo.
 *
 * Relaciones:
 * - Pertenece a un pedido (orders.id -> order_items.order_id)
 * - Pertenece a una variante de producto (product_variants.id -> order_items.product_variant_id)
 */
class OrderItem extends Model {}

OrderItem.init(
  {
    /**
     * Identificador único UUID del ítem del pedido
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Identificador del pedido al que pertenece este ítem
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
     * Identificador de la variante de producto comprada
     * Campo obligatorio, clave foránea hacia product_variants.id
     */
    product_variant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'product_variants',
        key: 'id',
      },
    },

    /**
     * Cantidad de unidades de esta variante en el pedido
     * Campo obligatorio, entero
     * Debe ser un valor positivo (mayor que 0)
     */
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },

    /**
     * Precio unitario al momento de la compra
     * Campo obligatorio, decimal con 10 dígitos totales y 2 decimales
     * Preserva el valor histórico del precio independientemente de cambios posteriores
     */
    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['order_id', 'product_variant_id'],
      },
    ],
  }
);

export default OrderItem;
