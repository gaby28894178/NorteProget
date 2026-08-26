# 🚀 NORTE - Frontend

## 📋 Descripción

SPA de **NORTE**, un e-commerce de moda y accesorios de diseño local. Es la aplicación cliente que se comunica con la API REST del backend e incluye el **panel de administración** (gestión de productos, categorías y pedidos) junto con un **dashboard de métricas** que lee el embudo de conversión desde Google Analytics 4.

---

## 🛠️ Stack Tecnológico

| Tecnología     | Uso                                    |
| -------------- | -------------------------------------- |
| React 19       | Librería UI                            |
| Vite 8         | Bundler y servidor de desarrollo       |
| React Router 7 | Navegación SPA                         |
| Tailwind CSS 4 | Estilos (tokens vía `@theme`)          |
| Axios          | Cliente HTTP hacia la API              |
| React Hook Form| Manejo de formularios                  |
| React Toastify | Notificaciones                         |
| react-ga4      | Envío de eventos de analítica a GA4    |
| jwt-decode     | Decodificar tokens JWT                 |
| React Icons    | Iconos (Lucide en admin, FontAwesome en público) |

---

## 📁 Estructura del Proyecto

```
frontend/
│
├── public/               # Assets estáticos (favicon, og-image, og-image-square)
├── src/
│   ├── api/              # Axios y endpoints (productApi, categoryApi, ordersApi, analyticsApi, authApi)
│   ├── assets/           # Imágenes y recursos
│   ├── components/
│   │   ├── admin/        # Panel de administración (ProductTable, ProductFilters, OrderTable, OrderFilters, CategoryTable, ...)
│   │   └── public/       # Componentes de la tienda (Navbar, Footer, FilterSidebar, CartItem, ...)
│   ├── context/          # Estado global (AuthContext, CartContext)
│   ├── data/             # Datos mock / seed (products, orders, categories, analyticsDemo)
│   ├── hooks/            # Custom hooks (useProducts, useOrders, useCategories, useAnalytics)
│   ├── layouts/          # Layouts público y admin
│   ├── pages/
│   │   ├── admin/        # Páginas del panel admin (AdminDashboardPage, AdminLoginPage, AdminProductsPage, ...)
│   │   └── public/       # Páginas de la tienda (Home, Catalogo, Producto, Carrito, Checkout, ...)
│   ├── routes/           # Definición de rutas (AppRouter)
│   ├── styles/           # Design system (globals.css, components.css)
│   └── utils/            # Helpers (analytics, apiErrors, gaData, googleAuth, orderHelpers, orderStatus)
│
├── .env.example          # Plantilla de variables de entorno
└── vite.config.js
```

---

## ⚙️ Variables de Entorno

Copiar `.env.example` a `.env.local` y ajustar si es necesario:

| Variable          | Descripción                                        | Default                              |
| ----------------- | -------------------------------------------------- | ------------------------------------ |
| `VITE_API_URL`    | Base URL de la API REST del backend                | `http://localhost:3001/api`          |
| `VITE_USE_MOCK`   | Usar datos mock en memoria si no hay backend real  | `true`                               |
| `VITE_APP_NAME`   | Nombre de la aplicación                            | `NorteProget`                        |
| `VITE_ADMIN_EMAIL`    | Email de acceso al panel admin (demo/mock)    | `soporte@norte.com`                  |
| `VITE_ADMIN_PASSWORD` | Contraseña de acceso al panel admin (demo/mock) | `cambiar-en-produccion`          |
| `VITE_GA_MEASUREMENT_ID` | Measurement ID de GA4 (envío de eventos)     | `G-XXXXXXXXXX`                       |
| `VITE_GA_CLIENT_ID`      | OAuth Client ID (Web app) para leer métricas | `XXXXX.apps.googleusercontent.com`   |
| `VITE_GA_PROPERTY_ID`    | Property ID numérico de la propiedad GA4     | `1234567890`                         |

---

## 📈 Métricas y Google Analytics 4 (Dashboard Admin)

El panel `GET /admin/dashboard` muestra el **embudo de conversión** del negocio
(visita → catálogo → producto → carrito → checkout → pago → compra) y KPIs.

### Envío de eventos (recolección)

Se instrumenta el flujo público con eventos estándar de GA4 (`view_item_list`,
`view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`,
`add_payment_info`, `purchase`, `login`, `cta_click`) vía `react-ga4`, sin
bloquear la experiencia del usuario. Código en `src/utils/analytics.js`.

> Para ver los eventos en tiempo real usá el **DebugView** de GA4.

### Lectura de métricas (dashboard)

El dashboard lee GA4 **directo desde el browser** con la cuenta de Google del
admin (OAuth client-side, scope `analytics.readonly`). Cuando no hay data o
falla la API, cae a **datos de demostración** para que la pantalla nunca quede
vacía. Código: `src/utils/googleAuth.js`, `src/utils/gaData.js`,
`src/api/analyticsApi.js`.

#### Configuración en Google Cloud (una sola vez)

1. **GA4 Property ID**: GA4 → Administrar → Configuración de la propiedad →
   anotar el número. Setear `VITE_GA_PROPERTY_ID`.
2. **Habilitar la API**: Google Cloud Console → APIs y servicios → Biblioteca →
   *Google Analytics Data API* → **Habilitar**.
3. **Pantalla de consentimiento**: APIs y servicios → Pantalla de consentimiento
   de OAuth → tipo **Externo**. Agregá tu cuenta en *Usuarios de prueba*.
4. **OAuth Client ID**: API y servicios → Credenciales → **+ Crear credenciales →
   ID de cliente de OAuth** → *Aplicación web* → **Orígenes de JavaScript
   autorizados**: la URL del deploy (`https://tu-dominio.vercel.app`) y
   `http://localhost:5173`. Copiá el Client ID en `VITE_GA_CLIENT_ID`.
5. **Acceso**: GA4 → Administrar → Gestión de accesos → tu cuenta debe tener al
   menos rol **Viewer**.

> En producción: publicar la pantalla de consentimiento (en modo *Testing* los
> tokens expiran a los 7 días) y verificar los orígenes autorizados.
>
> Nota de seguridad: el acceso por acá vale para demo/MVP. El flujo recomendado
> en producción es consultar la **Analytics Data API desde un backend** para no
> exponer datos GA4 en el navegador.

---

## 🔐 Login del Panel Admin

El panel (`/admin/*`) está protegido y requiere sesión. Sin sesión activa, las
rutas redirigen a `/admin/login`:

- **Credenciales (mock)**: las define `VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD`.
  Solo se usan mientras el backend de auth no exista.
- **Con backend real**: la pantalla consume `POST /auth/login` (misma capa en
  `src/api/authApi.js`). El token JWT se guarda en `localStorage` bajo `token` y
  el interceptor de Axios (`src/api/axiosConfig.js`) lo manda como
  `Authorization: Bearer <token>` automáticamente.
- **Cerrar sesión**: botón en el sidebar del admin (limpia token y sesión).

---

## 🚀 Instalación y Uso

```bash
npm install

# Desarrollo (HMR)
npm run dev

# Producción (build a dist/)
npm run build

# Lint
npm run lint
```

La app corre en `http://localhost:5173`.

---

## 🎨 Design System

Styles centralizados en `src/styles/`:

- `globals.css` — tokens de color (mostaza/verde/negro cálido/gris piedra), tipografía (Roboto Condensed + Roboto) y estilos de base. En Tailwind v4 los tokens se declaran en `@theme`.
- `components.css` — clases reutilizables (`.btn-primary`, `.btn-secondary`, `.input-field`, `.tab-item`, etc.).

---

## 📄 Licencia

Proyecto desarrollado con fines educativos como parte de la **Simulación Laboral Tech** de **ID For Ideas**.
