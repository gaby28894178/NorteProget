import ReactGA from "react-ga4";

const TRACKING_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const CURRENCY = "ARS";

export const initGA = () => {
  if (TRACKING_ID) {
    ReactGA.initialize(TRACKING_ID);
  } else {
    console.warn("VITE_GA_MEASUREMENT_ID no está configurado.");
  }
};

export const logPageView = (path) => {
  if (TRACKING_ID) {
    ReactGA.send({
      hitType: "pageview",
      page: path || window.location.pathname,
    });
  }
};

export const logEvent = (category, action, label = "") => {
  if (TRACKING_ID) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};

// =================
//    EVENTOS GA4
// =================

/**
 * Envía un evento GA4 con el nombre y los parámetros estándar del esquema
 * de ecommerce de GA4. No bloquea: gtag es fire-and-forget (fricción cero).
 */
const sendEvent = (name, params = {}) => {
  if (!TRACKING_ID) return;
  ReactGA.event(name, params);
};

/**
 * Normaliza un ítem del carrito al formato `items` de GA4.
 */
const toGA4Item = (item) => {
  const price = Number(item.price || 0);
  const quantity = Number(item.quantity || 1);

  return {
    item_id: String(item.id),
    item_name: item.name,
    item_category: item.category,
    price,
    quantity,
    ...(item.selectedColor ? { item_variant: item.selectedColor } : {}),
    ...(item.selectedSize ? { size: item.selectedSize } : {}),
  };
};

const itemsValue = (items = []) =>
  items.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

/** Vista de listado / catálogo. */
export const trackViewItemList = ({
  search = "",
  category = "",
  count = 0,
} = {}) => {
  sendEvent("view_item_list", {
    item_list_name: search ? "resultados_busqueda" : "catalogo",
    ...(category && category !== "Todas"
      ? { item_list_id: `categoria_${category.toLowerCase()}` }
      : {}),
    ...(search ? { search_term: search } : {}),
    ...(count ? { count } : {}),
  });
};

/** Resultados de búsqueda (paginación/render de resultados). */
export const trackViewSearchResults = ({ search = "", count = 0 } = {}) => {
  sendEvent("view_search_results", {
    search_term: search,
    ...(count ? { count } : {}),
  });
};

/** Vista de detalle de un producto. */
export const trackViewItem = ({ product }) => {
  if (!product) return;

  sendEvent("view_item", {
    currency: CURRENCY,
    value: Number(product.price || 0),
    items: [toGA4Item(product)],
  });
};

/** Producto agregado al carrito. */
export const trackAddToCart = ({ item }) => {
  if (!item) return;

  sendEvent("add_to_cart", {
    currency: CURRENCY,
    value: itemsValue([item]),
    items: [toGA4Item(item)],
  });
};

/** Producto eliminado del carrito. */
export const trackRemoveFromCart = ({ item }) => {
  if (!item) return;

  sendEvent("remove_from_cart", {
    currency: CURRENCY,
    value: itemsValue([item]),
    items: [toGA4Item(item)],
  });
};

/** Vista de la página del carrito. */
export const trackViewCart = ({ items = [], value = 0 } = {}) => {
  if (!items.length) return;

  sendEvent("view_cart", {
    currency: CURRENCY,
    value: value || itemsValue(items),
    items: items.map(toGA4Item),
  });
};

/** Inicio del checkout con los ítems del carrito. */
export const trackBeginCheckout = ({ items = [], value = 0 } = {}) => {
  sendEvent("begin_checkout", {
    currency: CURRENCY,
    value: value || itemsValue(items),
    items: items.map(toGA4Item),
  });
};

/** Método de pago enviado / inicio de pago. */
export const trackAddPaymentInfo = ({
  items = [],
  value = 0,
  paymentType,
} = {}) => {
  sendEvent("add_payment_info", {
    currency: CURRENCY,
    value: value || itemsValue(items),
    items: items.map(toGA4Item),
    ...(paymentType ? { payment_type: paymentType } : {}),
  });
};

/** Compra completada. */
export const trackPurchase = ({
  items = [],
  value = 0,
  transactionId,
  paymentType,
}) => {
  sendEvent("purchase", {
    currency: CURRENCY,
    transaction_id: transactionId || `norte-${Date.now()}`,
    value: value || itemsValue(items),
    items: items.map(toGA4Item),
    ...(paymentType ? { payment_type: paymentType } : {}),
  });
};

/** Usuario autenticado. */
export const trackLogin = ({ method = "email" } = {}) => {
  sendEvent("login", { method });
};

/** Clic en call-to-action genérico (home, catálogo, etc.). */
export const trackCtaClick = ({ cta = "", location = "" } = {}) => {
  sendEvent("cta_click", {
    ...(cta ? { cta_label: cta } : {}),
    ...(location ? { location } : {}),
  });
};
