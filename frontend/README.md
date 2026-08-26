# NORTE - Frontend

## Descripcion

SPA de **NORTE**, un e-commerce de moda y accesorios de diseño local. Incluye la tienda pública (catálogo, carrito, checkout) y el **panel de administración** (productos, categorías, pedidos) con un **dashboard de métricas** que lee el embudo de conversión desde Google Analytics 4.

---

## Stack Tecnológico

| Tecnologia     | Uso                                    |
| -------------- | -------------------------------------- |
| React 19       | Libreria UI                            |
| Vite 8         | Bundler y servidor de desarrollo       |
| React Router 7 | Navegacion SPA                         |
| Tailwind CSS 4 | Estilos (tokens via `@theme`)          |
| Axios          | Cliente HTTP hacia la API              |
| React Hook Form| Manejo de formularios                  |
| React Toastify | Notificaciones                         |
| react-ga4      | Envio de eventos de analitica a GA4    |
| jwt-decode     | Decodificar tokens JWT                 |
| React Icons    | Iconos (Lucide en admin, FontAwesome en publico) |

---

## Estructura del Proyecto

```
frontend/
├── public/                    # Favicon, icons, PWA manifest, og-images
├── src/
│   ├── api/                   # Capa de comunicación con la API
│   │   ├── axiosConfig.js       # Instancia axios + interceptores
│   │   ├── productApi.js        # CRUD productos (mock + real)
│   │   ├── categoryApi.js       # CRUD categorías (mock + real)
│   │   ├── ordersApi.js         # CRUD pedidos (mock + real)
│   │   ├── authApi.js           # Login admin (mock + real)
│   │   └── analyticsApi.js      # Métricas GA4 (con fallback a demo)
│   │
│   ├── assets/                # Imágenes estáticas (hero.png)
│   │
│   ├── components/
│   │   ├── admin/               # Panel de administración
│   │   │   ├── CategoryForm.jsx
│   │   │   ├── CategoryTable.jsx
│   │   │   ├── ConversionFunnel.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── OrderFilters.jsx
│   │   │   ├── OrderStatusSelect.jsx
│   │   │   ├── OrderStatusTimeline.jsx
│   │   │   ├── OrderTable.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── ProductTable.jsx
│   │   │   └── RequireAdmin.jsx
│   │   │
│   │   └── public/              # Tienda publica
│   │       ├── Buttons/Primary/Button.jsx
│   │       ├── CartItem.jsx
│   │       ├── FilterSidebar.jsx
│   │       ├── Footer.jsx
│   │       └── Navbar.jsx
│   │
│   ├── context/               # Estado global (React Context)
│   │   ├── AuthContext.jsx       # Sesion admin + login publico
│   │   └── CartContext.jsx       # Carrito de compras
│   │
│   ├── data/                  # Datos mock/seed (TODO: limpiar)
│   │   ├── products.json         # Seed de productos
│   │   ├── categories.json       # Seed de categorias
│   │   ├── orders.json           # Seed de pedidos
│   │   ├── products.js           # Productos hardcodeados (paginas publicas)
│   │   └── analyticsDemo.js      # Metricas demo para dashboard
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── useProducts.js        # Productos + filtros + CRUD
│   │   ├── useCategories.js      # Categorías + paginación
│   │   ├── useOrders.js          # Pedidos + filtros + sort
│   │   └── useAnalytics.js       # Métricas GA4
│   │
│   ├── layouts/               # Layouts de página
│   │   ├── AdminLayout.jsx       # Shell del admin (sidebar + contenido)
│   │   └── PublicLayout.jsx      # Navbar + Footer
│   │
│   ├── pages/
│   │   ├── admin/               # Páginas del panel admin
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── AdminCategoriesPage.jsx
│   │   │   ├── AdminOrdersPage.jsx
│   │   │   └── AdminProductsPage.jsx
│   │   │
│   │   └── public/              # Páginas de la tienda
│   │       ├── Home.jsx
│   │       ├── Catalogo.jsx
│   │       ├── Producto.jsx
│   │       ├── Carrito.jsx
│   │       ├── Checkout.jsx
│   │       ├── Pago.jsx
│   │       ├── Confirmacion.jsx
│   │       ├── Login.jsx
│   │       ├── PreguntasFrecuentes.jsx
│   │       └── CambiosDevoluciones.jsx
│   │
│   ├── routes/
│   │   └── AppRouter.jsx        # Definición de rutas (public + admin)
│   │
│   ├── styles/
│   │   ├── globals.css           # Tokens de color, tipografía, base
│   │   └── components.css        # Clases reutilizables (.btn-primary, etc.)
│   │
│   └── utils/
│       ├── analytics.js          # Envio de eventos GA4
│       ├── apiErrors.js          # Manejo de errores de API
│       ├── gaData.js             # Lectura de metricas GA4
│       ├── googleAuth.js         # OAuth client-side para GA4
│       ├── orderHelpers.js       # Normalizacion y filtrado de pedidos
│       └── orderStatus.js        # Metadata de estados de pedido
│
├── .env.example              # Plantilla de variables de entorno
├── vite.config.js            # Config de Vite (plugin React + Tailwind)
├── tailwind.config.js        # Tokens de color norte
├── eslint.config.js          # ESLint flat config
├── postcss.config.js         # PostCSS (Tailwind + Autoprefixer)
├── vercel.json               # Config de deploy (SPA rewrites)
└── index.html                # Entry point + SEO meta tags
```

---

## Variables de Entorno

Copiar `.env.example` a `.env.local` y ajustar si es necesario:

| Variable               | Descripcion                                        | Default                              |
| ---------------------- | -------------------------------------------------- | ------------------------------------ |
| `VITE_API_URL`         | Base URL de la API REST del backend                | `http://localhost:3001/api`          |
| `VITE_USE_MOCK`        | Usar datos mock en memoria si no hay backend real  | `true`                               |
| `VITE_APP_NAME`        | Nombre de la aplicacion                            | `NorteProget`                        |
| `VITE_ADMIN_EMAIL`     | Email de acceso al panel admin (demo/mock)         | `soporte@norte.com`                  |
| `VITE_ADMIN_PASSWORD`  | Contrasena de acceso al panel admin (demo/mock)    | `cambiar-en-produccion`              |
| `VITE_GA_MEASUREMENT_ID` | Measurement ID de GA4 (envio de eventos)         | `G-XXXXXXXXXX`                       |
| `VITE_GA_CLIENT_ID`    | OAuth Client ID (Web app) para leer metricas       | `XXXXX.apps.googleusercontent.com`   |
| `VITE_GA_PROPERTY_ID`  | Property ID numerico de la propiedad GA4           | `123234567890`                       |

---

## Metricas y Google Analytics 4 (Dashboard Admin)

El dashboard muestra el **embudo de conversión** del negocio
(visita -> catalogo -> producto -> carrito -> checkout -> pago -> compra) y KPIs.

### Envío de eventos (recolección)

Se instrumenta el flujo público con eventos estándar de GA4 (`view_item_list`,
`view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`,
`add_payment_info`, `purchase`, `login`, `cta_click`) via `react-ga4`. Código en
`src/utils/analytics.js`.

> Para ver los eventos en tiempo real usa el **DebugView** de GA4.

### Lectura de métricas (dashboard)

El dashboard lee GA4 **directo desde el browser** con la cuenta de Google del
admin (OAuth client-side, scope `analytics.readonly`). Cuando no hay data o
falla la API, cae a **datos de demostración** para que la pantalla nunca quede
vacia. Codigo en: `src/utils/googleAuth.js`, `src/utils/gaData.js`,
`src/api/analyticsApi.js`.

#### Configuracion en Google Cloud (una sola vez)

1. **GA4 Property ID**: GA4 -> Administrar -> Configuracion de la propiedad ->
   anotar el numero. Setear `VITE_GA_PROPERTY_ID`.
2. **Habilitar la API**: Google Cloud Console -> APIs y servicios -> Biblioteca ->
   *Google Analytics Data API* -> **Habilitar**.
3. **Pantalla de consentimiento**: APIs y servicios -> Pantalla de consentimiento
   de OAuth -> tipo **Externo**. Agrega tu cuenta en *Usuarios de prueba*.
4. **OAuth Client ID**: API y servicios -> Credenciales -> **+ Crear credenciales ->
   ID de cliente de OAuth** -> *Aplicacion web* -> **Origenes de JavaScript
   autorizados**: la URL del deploy (`https://tu-dominio.vercel.app`) y
   `http://localhost:5173`. Copia el Client ID en `VITE_GA_CLIENT_ID`.
5. **Acceso**: GA4 -> Administrar -> Gestion de accesos -> tu cuenta debe tener al
   menos rol **Viewer**.

> En produccion: publicar la pantalla de consentimiento (en modo *Testing* los
> tokens expiran a los 7 dias) y verificar los origenes autorizados.
>
> Nota de seguridad: el acceso por aca vale para demo/MVP. El flujo recomendado
> en produccion es consultar la **Analytics Data API desde un backend** para no
> exponer datos GA4 en el navegador.

---

## Login del Panel Admin

El panel (`/admin/*`) esta protegido y requiere sesion. Sin sesion activa, las
rutas redirigen a `/admin/login`:

- **Credenciales (mock)**: las define `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD`.
  Sólo se usan mientras el backend de auth no exista.
- **Con backend real**: la pantalla consume `POST /auth/login` (misma capa en
  `src/api/authApi.js`). El token JWT se guarda en `localStorage` bajo `token` y
  el interceptor de Axios (`src/api/axiosConfig.js`) lo manda como
  `Authorization: Bearer <token>` automaticamente.
- **Cerrar sesión**: boton en el sidebar del admin (limpia token y sesión).

---

## Instalacion y Uso

```bash
npm install

# Desarrollo (HMR)
npm run build    # Primero build para verificar que no hay errores
npm run dev

# Produccion (build a dist/)
npm run build

# Lint
npm run lint

# Preview de produccion
npm run preview
```

La app corre en `http://localhost:5173`.

---

## Design System

Styles centralizados en `src/styles/`:

- `globals.css` — tokens de color (mustard/forest/norte-dark/norte-stone/norte-bg), tipografía (Roboto Condensed + Roboto) y estilos base. En Tailwind v4 los tokens se declaran en `@theme`.
- `components.css` — clases reutilizables (`.btn-primary`, `.btn-secondary`, `.input-field`, `.tab-item`, etc.).

### Paleta de colores

| Token          | Hex       | Uso                        |
| -------------- | --------- | -------------------------- |
| `norte-mustard`| `#C77D2E` | Acentos, CTAs, activos     |
| `norte-forest` | `#33402F` | Acentos secundarios, badges|
| `norte-dark`   | `#1C1B19` | Texto principal            |
| `norte-stone`  | `#D8D2C4` | Bordes, backgrounds suaves |
| `norte-bg`     | `#F3EFE7` | Background de pagina       |

---

## Licencia

Proyecto desarrollado con fines educativos como parte de la **Simulacion Laboral Tech** de **ID For Ideas**.
