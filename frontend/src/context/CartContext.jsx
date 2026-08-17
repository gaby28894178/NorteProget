import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  // =========================
  // CARGAR CARRITO
  // =========================

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
      return [];
    }

    try {
      const parsedCart = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      return parsedCart.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      }));
    } catch (error) {
      console.error(
        "Error al leer el carrito:",
        error
      );

      return [];
    }
  });

  // =========================
  // GUARDAR CARRITO
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // =========================
  // AGREGAR AL CARRITO
  // =========================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const cantidadNueva =
        Number(product.quantity) || 1;

      const existingProduct = currentCart.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor ===
            product.selectedColor &&
          item.selectedSize ===
            product.selectedSize
      );

      // Si ya existe el mismo producto,
      // color y talle, acumular cantidad
      if (existingProduct) {
        return currentCart.map((item) => {
          if (
            item.id === product.id &&
            item.selectedColor ===
              product.selectedColor &&
            item.selectedSize ===
              product.selectedSize
          ) {
            return {
              ...item,
              price: Number(item.price) || 0,
              quantity:
                (Number(item.quantity) || 0) +
                cantidadNueva,
            };
          }

          return item;
        });
      }

      // Producto nuevo
      return [
        ...currentCart,
        {
          ...product,
          price: Number(product.price) || 0,
          quantity: cantidadNueva,
        },
      ];
    });
  };

  // =========================
  // ELIMINAR PRODUCTO
  // =========================

  const removeFromCart = (
    id,
    selectedColor,
    selectedSize
  ) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
  };

  // =========================
  // AUMENTAR CANTIDAD
  // =========================

  const increaseQuantity = (
    id,
    selectedColor,
    selectedSize
  ) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
        ) {
          return {
            ...item,
            price: Number(item.price) || 0,
            quantity:
              (Number(item.quantity) || 0) + 1,
          };
        }

        return item;
      })
    );
  };

  // =========================
  // DISMINUIR CANTIDAD
  // =========================

  const decreaseQuantity = (
    id,
    selectedColor,
    selectedSize
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (
            item.id === id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ) {
            return {
              ...item,
              price: Number(item.price) || 0,
              quantity:
                (Number(item.quantity) || 0) - 1,
            };
          }

          return item;
        })
        .filter(
          (item) =>
            Number(item.quantity) > 0
        )
    );
  };

  // =========================
  // VACIAR CARRITO
  // =========================

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // =========================
  // TOTAL DE PRODUCTOS
  // =========================

  const totalItems = cart.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 0),
    0
  );

  // =========================
  // TOTAL DE DINERO
  // =========================

  const totalPrice = cart.reduce(
    (total, item) => {
      const precio =
        Number(item.price) || 0;

      const cantidad =
        Number(item.quantity) || 0;

      return total + precio * cantidad;
    },
    0
  );

  // =========================
  // CONTEXT
  // =========================

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =========================
// HOOK
// =========================

const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider"
    );
  }

  return context;
};

export {
  CartProvider,
  // eslint-disable-next-line react-refresh/only-export-components
  useCart,
};