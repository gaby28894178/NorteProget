const Footer = () => {
  return (
    <footer className="w-full px-6 md:px-12 py-6 md:py-8 bg-white border-t border-gris-piedra">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <p className="text-negro-calido font-body text-base font-normal">
          © {new Date().getFullYear()} NORTE. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
