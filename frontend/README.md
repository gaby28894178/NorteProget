# 🚀 NORTE - Frontend

## 📋 Descripción del Proyecto

**NORTE** es una tienda de ropa online (e-commerce) desarrollada como parte del proyecto **NorteProget**, gestionado bajo metodología Scrum. Este repositorio contiene el **cliente frontend (SPA)** construido con React + Vite, que incluye tanto la **tienda pública** (catálogo, detalle de producto, checkout y pago) como el **panel de administración** (gestión de productos y categorías).

---

## 🏗️ Arquitectura del Proyecto

```
frontend/
├── public/                     # Assets estáticos servidos por Vite
├── src/
│   ├── api/
│   │   ├── axiosConfig.js      # Cliente Axios base + interceptor JWT
│   │   ├── categoryApi.js      # CRUD de categorías (mock ↔ backend según VITE_USE_MOCK)
│   │   └── productApi.js       # CRUD de productos con variantes e imágenes
│   ├── assets/                 # Imágenes y recursos estáticos
│   ├── components/
│   │   ├── admin/
│   │   │   ├── CategoryForm.jsx    # Form alta/edición de categoría (react-hook-form)
│   │   │   ├── CategoryTable.jsx   # Tabla de categorías (sin columna ID)
│   │   │   ├── ProductForm.jsx     # Form alta/edición de producto (variantes + imágenes)
│   │   │   ├── ProductTable.jsx    # Tabla de productos (fila clickeable → detalle)
│   │   │   └── ProductDetail.jsx   # Vista de detalle (galería, stock, variantes)
│   │   └── public/
│   │       ├── Navbar.jsx          # Navbar de la tienda
│   │       ├── Navbar.css
│   │       └── Footer.jsx          # Pie de página
│   ├── context/
│   │   ├── AuthContext.jsx     # Estado de autenticación (localStorage + login/logout)
│   │   └── CartContext.jsx     # Carrito de compras (persistido en localStorage)
│   ├── data/
│   │   ├── categories.json     # Semilla de categorías (5 categorías)
│   │   ├── products.json       # Semilla de productos (8 productos con variantes/imágenes)
│   │   └── products.js         # Datos de productos usados por la tienda pública
│   ├── hooks/
│   │   ├── useCategories.js    # Lógica de CRUD de categorías + notificaciones
│   │   └── useProducts.js      # Lógica de CRUD de productos + vistas (form/detalle)
│   ├── layouts/
│   │   ├── AdminLayout.jsx     # Layout del admin (sidebar + topbar móvil)
│   │   ├── PublicLayout.jsx    # Layout base de la tienda pública
│   │   └── admin.css
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminCategoriesPage.jsx   # Gestión de categorías (modal CRUD)
│   │   │   └── AdminProductsPage.jsx     # Gestión de productos (lista/form/detalle)
│   │   └── public/
│   │       ├── Home.jsx        # Página de inicio (hero)
│   │       ├── Catalogo.jsx    # Listado de productos con filtro por categoría
│   │       ├── Producto.jsx    # Detalle de producto
│   │       ├── Checkout.jsx    # Datos del comprador (requiere login)
│   │       ├── Pago.jsx        # Selección de método de pago
│   │       ├── Confirmacion.jsx# Confirmación de compra
│   │       └── Login.jsx       # Inicio de sesión
│   ├── routes/
│   │   └── AppRouter.jsx       # Configuración de rutas públicas y admin
│   ├── styles/
│   │   ├── globals.css         # Reset y estilos base
│   │   └── variables.css       # Variables CSS de la marca NORTE
│   ├── utils/
│   │   ├── slugUtils.js        # Generación/validación de slugs
│   │   └── skuGenerator.js     # Generador de SKU (CATEGORIA-CODIGO-COLOR-TALLE)
│   ├── App.css
│   ├── App.jsx                 # Componente raíz (Providers + Router + Toasts)
│   ├── index.css               # Tailwind v4 + paleta NORTE
│   └── main.jsx                # Punto de entrada
├── .env.example                # Ejemplo de variables de entorno
├── .gitignore
├── index.html
├── package.json
├── vercel.json                 # Config de despliegue y rewrites SPA en Vercel
├── vite.config.js              # Configuración de Vite
├── tailwind.config.js          # Paleta NORTE (dark, bg, mustard, forest, stone)
├── postcss.config.js           # Configuración de PostCSS
└── README.md
```

---

## 🛠️ Stack Tecnológico

| Tecnología           | Versión | Uso                              |
| -------------------- | ------- | -------------------------------- |
| **React**            | 19.2    | Librería UI (SPA)                |
| **Vite**             | 8.2     | Bundler / Dev Server             |
| **React Router DOM** | 7.18    | Enrutamiento SPA                 |
| **Axios**            | 1.19    | Cliente HTTP para API            |
| **Tailwind CSS**     | 4.3     | Framework de estilos (utilidades)|
| **React Hook Form**  | 7.84    | Manejo de formularios            |
| **React Toastify**   | 11.1    | Notificaciones                   |
| **React Icons**      | 5.7     | Iconos (lucide)                  |
| **jwt-decode**       | 4.0     | Decodificar tokens JWT           |

**Dependencias de Desarrollo:**

| Tecnología                          | Versión | Uso                            |
| ----------------------------------- | ------- | ------------------------------ |
| **ESLint**                          | 10.8    | Linting (config plana)         |
| **@vitejs/plugin-react**            | 6.0     | Plugin de React para Vite      |
| **@tailwindcss/postcss**            | 4.3     | Plugin PostCSS de Tailwind v4  |
| **PostCSS**                         | 8.5     | Procesador de CSS              |
| **autoprefixer**                    | 10.5    | Prefijos CSS de navegadores    |
| **@types/react / @types/react-dom** | 19.2    | Tipos de TypeScript para React |

---

## ⚙️ Variables de Entorno (.env)

| Variable          | Descripción                                                     | Default |
| ----------------- | --------------------------------------------------------------- | ------- |
| `VITE_API_URL`    | URL base del backend (ej: `http://localhost:3001/api`)          | `http://localhost:3001/api` |
| `VITE_USE_MOCK`   | Usa datos mock en memoria (no llama al backend)                 | —       |
| `VITE_APP_NAME`   | Nombre de la aplicación                                         | `NorteProget` |

**Nota sobre mock vs backend:** las capas `api/*` deciden automáticamente el modo. Si `VITE_USE_MOCK === "true"` **o** no se define `VITE_API_URL`, la app funciona con los datos mock de `src/data/` en memoria. Para conectar el backend real solo hay que setear `VITE_API_URL` — no requiere cambios en componentes.

---

## 📦 Instalación

### Prerrequisitos

- Node.js >= 20.19 (recomendado 22.x)
- npm (incluido con Node.js)

### Pasos

```bash
# 1. Ir a la carpeta frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Copiar el archivo de variables de entorno
cp .env.example .env

# 4. Configurar VITE_API_URL (o dejar VITE_USE_MOCK=true para usar datos locales)

# 5. Iniciar el servidor de desarrollo
npm run dev
```

---

## 🖥️ Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

| Comando        | Descripción                          |
| -------------- | ------------------------------------ |
| `npm run dev`  | Inicia el dev server (Vite)          |
| `npm run build`| Compila el proyecto a `dist/`        |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta ESLint sobre todo el código  |

---

## 🧭 Rutas

### Tienda pública (`PublicLayout` + Navbar/Footer por página)

| Ruta               | Página       | Descripción                                |
| ------------------ | ------------ | ------------------------------------------ |
| `/`                | `Home`       | Página de inicio                           |
| `/catalogo`        | `Catalogo`   | Catálogo con filtro por categoría          |
| `/producto/:id`    | `Producto`   | Detalle de producto (usuario puede comprar)|
| `/checkout`        | `Checkout`   | Datos del comprador (requiere login)       |
| `/pago`            | `Pago`       | Selección de método de pago                |
| `/confirmacion`    | `Confirmacion` | Confirmación de compra                   |
| `/login`           | `Login`      | Inicio de sesión                           |
| `/carrito`         | `Cart`       | Carrito de compras (en construcción)       |

### Panel Admin (`AdminLayout`)

| Ruta                | Página                  | Descripción                                   |
| ------------------- | ----------------------- | --------------------------------------------- |
| `/admin`            | → redirige a dashboard  | Panel de administración                       |
| `/admin/dashboard`  | `Dashboard`             | Métricas (placeholder)                        |
| `/admin/productos`  | `AdminProductsPage`     | CRUD completo de productos                    |
| `/admin/categorias` | `AdminCategoriesPage`   | CRUD de categorías (modal)                    |
| `/admin/pedidos`    | `Orders`                | Gestión de pedidos (placeholder)              |

> **Nota:** las rutas admin aún no están protegidas (el login no está cableado al backend). Está previsto envolverlas en `<PrivateRoute>` cuando exista autenticación real.

---

## 🛍️ Funcionalidades del Panel Admin

### Gestión de Productos (`/admin/productos`)

CRUD completo con datos ricos alineados al modelo del backend:

- **Lista:** tabla con imagen, nombre, slug, categoría, precio, stock total, nº de variantes y estado. Las filas son clickeables (abren el detalle) y los botones Ver/Editar/Eliminar no propagan el click.
- **Alta / Edición** (`ProductForm`):
  - Datos generales: categoría, nombre, slug (autogenerado), descripción, precio y estado (Publicado/Oculto).
  - **Variantes** (talla × color): SKU, talla, color, stock y marca de variante predeterminada (solo una). Se validan duplicados de talla+color y de SKU.
  - **Imágenes**: URL + orden de visualización. El `public_id` (referencia interna de Cloudinary) se genera automáticamente (`norte/products/<slug>/<orden>`) y no es editable.
  - El **SKU se autogenera** mediante `skuGenerator.js` con el formato `CATEGORIA-CODIGO-COLOR-TALLE` (ej: `REM-NOR-NEG-S`, `CAM-URB-GRI-M`), se recalcula al cambiar categoría/nombre/color/talla y es read-only.
  - Protección anti-Enter: si se guarda una edición sin cambios reales, se muestra un toast informativo y no se cierra el form.
- **Detalle** (`ProductDetail`): galería de imágenes, información, resumen visual de stock (colores con swatch + talles) y tabla detallada de variantes.
- **Borrado:** diálogo de confirmación que advierte que se eliminan variantes e imágenes en cascada.

### Gestión de Categorías (`/admin/categorias`)

- Tabla con **Nombre | Slug | Estado | Acciones** (la columna ID se oculta al admin; el `id` se mantiene internamente como vínculo con los productos).
- Alta/edición en modal con slug autogenerado y validación de unicidad.
- Eliminación directa con confirmación.

---

## 🔧 Detalles Técnicos Relevantes

### Modo mock (sin backend)

Las capas `src/api/categoryApi.js` y `src/api/productApi.js` exponen el mismo contrato (get/create/update/delete) y, cuando `USE_MOCK` es verdadero, operan sobre arrays en memoria inicializados desde `src/data/*.json`. Esto permite desarrollar el frontend sin backend.

### Paleta NORTE (Tailwind)

```js
// tailwind.config.js
norte: {
  dark:    "#1C1B19", // Texto y base
  bg:      "#F3EFE7", // Off-white fondo
  mustard: "#C77D2E", // Acento principal
  forest:  "#33402F", // Acento secundario
  stone:   "#D8D2C4", // Bordes y neutros
}
```

### Organización de estilos

- `index.css` → Tailwind v4 (`@import "tailwindcss"`) + `@config` para la paleta.
- `src/styles/globals.css` → reset y base en `@layer base` (para que las utilidades de Tailwind puedan sobreescribir).
- `src/styles/variables.css` → variables CSS de la marca (colores, tipografía, sombras, spacing).
- Páginas públicas usan CSS por clase (`*.css` junto a cada página) con prefijos BEM (`hero__title`, `producto-card`, etc.).

---

## 🚀 Despliegue (Vercel)

El frontend está configurado para desplegarse mediante **Vercel** desde la subcarpeta `frontend/`.

### Configuración de Vercel (`vercel.json`)

```json
{
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- `outputDirectory: "dist"` → apunta a la build de Vite.
- `rewrites` → soluciona el enrutamiento de la SPA (todas las rutas caen a `index.html`).

### Despliegue desde la Terminal (Vercel CLI)

```bash
npm install -g vercel   # 1. Instalar CLI
vercel login            # 2. Iniciar sesión

cd frontend
vercel                  # 3. Preview (entorno de pruebas)
vercel --prod           # 4. Producción
```

---

## 🔀 Estrategia de Branching

```
main (producción)
│
└── develop (integración / staging)
    │
    ├── feature/admin-products-crud
    ├── feature/admin-categories-crud
    └── fix/bug-name
```

---

## 👥 Equipo

- **PM / Scrum Master** - Gestión del proyecto
- **UI/UX Designer** - Diseño de interfaces
- **Frontend Developers** - Desarrollo de la SPA
- **QA / Testers** - Pruebas y calidad

---

## 📄 Documentación Adicional

Consultar los documentos del proyecto:

- `01-NORTE-Brief-del-Proyecto.docx` - Brief general
- `03-NORTE-Guia-UI-UX.docx` - Guía UI/UX
- `04-NORTE-Guia-Frontend.docx` - Guía específica Frontend
- `07-NORTE-Guia-QA-Testers.docx` - Guía QA
- `09-NORTE-Guia-Marketing-Digital.docx` - Marketing Digital

---

## 📝 Licencia

Proyecto privado - NORTE © 2026
