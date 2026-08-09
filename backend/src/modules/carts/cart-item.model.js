import { DataTypes, Model } from 'sequelize';
import sequelize from '../../database/database.js';

/**
 * Modelo de Ítem de Carrito (cart_items)
 * Almacena los productos/variantes agregados a un carrito de compras,
 * junto con la cantidad deseada.
 *
 * Restricciones de integridad:
 * - Un carrito no puede contener la misma variante de producto más de una vez.
 *   Si el usuario agrega nuevamente la misma variante, se actualiza la cantidad
 *   del registro existente en lugar de crear uno nuevo.
 *   Índice único compuesto: (cart_id, product_variant_id)
 *
 * Relaciones:
 * - Pertenece a un carrito (carts.id -> cart_items.cart_id)
 * - Pertenece a una variante de producto (product_variants.id -> cart_items.product_variant_id)
 */
class CartItem extends Model {}

CartItem.init(
  {
    /**
     * Identificador único UUID del ítem del carrito
     * Clave primaria generada automáticamente
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    /**
     * Identificador del carrito al que pertenece este ítem
     * Campo obligatorio, clave foránea hacia carts.id
     */
    cart_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'carts',
        key: 'id',
      },
    },

    /**
     * Identificador de la variante de producto agregada al carrito
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
     * Cantidad de unidades de esta variante en el carrito
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
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['cart_id', 'product_variant_id'],
      },
    ],
  }
);

export default CartItem;
