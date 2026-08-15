import { Link } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const {
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const subtotal = item.price * item.quantity;

  return (
    <article className="border-b border-gray-200 py-6">

      <div className="flex flex-col gap-5 sm:flex-row">

        {/* =========================
            IMAGEN
        ========================== */}

        <Link
          to={`/producto/${item.id}`}
          className="block w-full shrink-0 overflow-hidden bg-gray-100 sm:w-32"
        >
          <div className="aspect-square">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
            />
          </div>
        </Link>

        {/* =========================
            INFORMACIÓN
        ========================== */}

        <div className="flex flex-1 flex-col justify-between gap-5">

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">

            <div>

              <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                {item.category}
              </p>

              <Link
                to={`/producto/${item.id}`}
                className="text-base font-medium hover:text-[#a86620]"
              >
                {item.name}
              </Link>

              {/* COLOR */}

              {item.selectedColor && (
                <p className="mt-2 text-xs text-gray-500">
                  Color:{" "}
                  <span className="text-gray-800">
                    {item.selectedColor}
                  </span>
                </p>
              )}

              {/* TALLE */}

              {item.selectedSize && (
                <p className="text-xs text-gray-500">
                  Talle:{" "}
                  <span className="text-gray-800">
                    {item.selectedSize}
                  </span>
                </p>
              )}

            </div>

            {/* PRECIO */}

            <div className="text-left sm:text-right">

              <p className="text-sm font-semibold">
                $
                {subtotal.toLocaleString("es-AR")}
              </p>

              {item.quantity > 1 && (
                <p className="mt-1 text-[10px] text-gray-500">
                  $
                  {item.price.toLocaleString("es-AR")}{" "}
                  c/u
                </p>
              )}

            </div>

          </div>

          {/* =========================
              CONTROLES
          ========================== */}

          <div className="flex items-center justify-between">

            {/* CANTIDAD */}

            <div className="flex items-center overflow-hidden rounded-md border border-gray-300">

              <button
                type="button"
                onClick={() =>
                  decreaseQuantity(
                    item.id,
                    item.selectedColor,
                    item.selectedSize
                  )
                }
                aria-label="Disminuir cantidad"
                className="flex h-9 w-9 items-center justify-center text-xs transition hover:bg-gray-100"
              >
                <FaMinus />
              </button>

              <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-300 px-2 text-xs">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  increaseQuantity(
                    item.id,
                    item.selectedColor,
                    item.selectedSize
                  )
                }
                aria-label="Aumentar cantidad"
                className="flex h-9 w-9 items-center justify-center text-xs transition hover:bg-gray-100"
              >
                <FaPlus />
              </button>

            </div>

            {/* ELIMINAR */}

            <button
              type="button"
              onClick={() =>
                removeFromCart(
                  item.id,
                  item.selectedColor,
                  item.selectedSize
                )
              }
              className="flex items-center gap-2 text-xs text-gray-500 transition hover:text-red-600"
            >
              <FaTrash className="text-[11px]" />

              <span>Eliminar</span>
            </button>

          </div>

        </div>

      </div>

    </article>
  );
};

export default CartItem;