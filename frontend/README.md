# 🚀 NORTE - Frontend

## 📋 Descripción

SPA de **NORTE**, un e-commerce de moda y accesorios de diseño local. Es la aplicación cliente que se comunica con la API REST del backend.

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
| jwt-decode     | Decodificar tokens JWT                 |
| React Icons    | Iconos (Lucide en admin, FontAwesome en público) |

---

## 📁 Estructura del Proyecto

```
frontend/
│
├── public/               # Assets estáticos (favicon, og-image)
├── src/
│   ├── api/              # Axios y endpoints (productApi, categoryApi, ordersApi)
│   ├── assets/           # Imágenes y recursos
│   ├── components/       # Componentes públicos y del panel admin
│   ├── context/          # Estado global (AuthContext, CartContext)
│   ├── data/             # Datos mock / seed para desarrollo
│   ├── hooks/            # Custom hooks
│   ├── layouts/          # Layouts público y admin
│   ├── pages/            # Páginas públicas y admin
│   ├── routes/           # Definición de rutas (AppRouter)
│   ├── styles/           # Design system (globals.css, components.css)
│   └── utils/            # Helpers (skuGenerator, orderStatus, slugUtils)
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