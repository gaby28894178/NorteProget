
import { Link, NavLink } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar__container">

        <Link to="/" className="navbar__logo">
          NORTE
        </Link>

        <nav className="navbar__menu">

          <NavLink to="/" className="navbar__link">
            Inicio
          </NavLink>

          <NavLink to="/catalogo" className="navbar__link">
            Catálogo
          </NavLink>

          <NavLink
            to="/carrito"
            className="navbar__cart"
            aria-label="Carrito"
          >
            <FaShoppingBag />
          </NavLink>

        </nav>

      </div>
    </header>
  );
};

export default Navbar;

