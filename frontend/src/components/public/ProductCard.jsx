import { Link } from "react-router-dom";

const obtenerColorClase = (color) => {
  switch (color) {
    case "Negro":
      return "bg-black";

    case "Blanco":
      return "bg-white";

    case "Nude":
      return "bg-[#d8b9a0]";

    case "Camel":
      return "bg-[#b88a5a]";

    case "Rojo":
      return "bg-red-600";

    case "Azul":
    case "Azul Marino":
      return "bg-blue-600";

    case "Verde":
    case "Verde Militar":
      return "bg-norte-militar";

    case "Gris":
    case "Gris Oxford":
      return "bg-gray-400";

    case "Beige":
      return "bg-[#d4c5a9]";

    default:
      return "bg-gray-300";
  }
};

const ProductCard = ({ product }) => {
  return (
    <article className="group">
      {/* IMAGEN */}

      <Link
        to={`/producto/${product.id}`}
        className="block overflow-hidden bg-gray-100"
      >
        <div className="aspect-square">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </Link>

      {/* COLORES */}

      <div className="mt-3 flex items-center gap-1.5">
        {product.colors?.map((color) => (
          <span
            key={color}
            title={color}
            className={`h-5 w-5 rounded-full border border-gray-300 ${obtenerColorClase(
              color,
            )}`}
          />
        ))}
      </div>

      {/* INFORMACIÓN */}

      <div className="mt-2">
        <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">
          {product.categoryName}
        </p>

        <Link to={`/producto/${product.id}`}>
          <h2 className="text-base font-normal leading-tight hover:underline">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 text-xl font-medium">
          ${Number(product.current_price).toLocaleString("es-AR")}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          2x $
          {Math.round(Number(product.current_price) / 2).toLocaleString(
            "es-AR",
          )}{" "}
          sin interés
        </p>

        {/* COMPRAR */}

        <Link
          to={`/producto/${product.id}`}
          className="mt-3 inline-flex rounded-btn bg-norte-mustard px-4 py-1.5 text-xs font-medium text-white transition hover:bg-mostaza-4"
        >
          Ver producto
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
