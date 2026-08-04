# 🚀 NorteProget

## 📋 Descripción

**NorteProget** es una plataforma digital fullstack desarrollada bajo metodología ágil (Scrum). El proyecto está organizado en dos módulos principales: Frontend (SPA con React) y Backend (API REST con Node.js/Express), cada uno en su propio directorio con su configuración independiente.

---

## 🏗️ Estructura General del Repositorio

```
NorteProget/
├── frontend/           # Aplicación cliente (SPA)
├── backend/            # Servidor API REST
├── README.md           # Este archivo (documentación general)
└── *.docx              # Documentación del proyecto por rol
```

---

## 📂 Contenido de Cada Folder

### 📁 `frontend/`

Contiene toda la aplicación cliente que se ejecuta en el navegador del usuario. Es una **Single Page Application (SPA)** que se comunica con el backend a través de peticiones HTTP.

| Elemento | Descripción |
|----------|-------------|
| `src/components/` | Componentes reutilizables de React (Navbar, Footer, Buttons, Cards) |
| `src/pages/` | Páginas de la aplicación (Home, Login, Register, Dashboard, Profile) |
| `src/router/` | Configuración de rutas públicas y privadas (React Router DOM) |
| `src/api/` | Configuración de Axios y funciones para consumir la API |
| `src/context/` | Contextos de React para manejo de estado global (Auth) |
| `src/hooks/` | Custom hooks (useAuth, useFetch) |
| `src/styles/` | Estilos globales y variables CSS / Tailwind |
| `src/utils/` | Constantes y funciones auxiliares |
| `.env` | Variables de entorno (URL del backend, nombre de la app) |
| `vite.config.js` | Configuración del bundler Vite |
| `tailwind.config.js` | Configuración de Tailwind CSS |

**Stack Frontend:**

| Tecnología | Uso |
|------------|-----|
| React 18 | Librería UI para construir interfaces |
| Vite 5 | Bundler y servidor de desarrollo rápido |
| React Router DOM 6 | Navegación SPA sin recargar página |
| Axios | Cliente HTTP para consumir la API REST |
| Tailwind CSS 3 | Framework CSS utility-first para estilos |
| React Hook Form | Manejo y validación de formularios |
| React Toastify | Notificaciones al usuario |
| jwt-decode | Decodificar tokens JWT en el cliente |
| React Icons | Librería de iconos |

---

### 📁 `backend/`

Contiene el servidor API REST que maneja toda la lógica de negocio, autenticación, autorización y comunicación con la base de datos PostgreSQL.

| Elemento | Descripción |
|----------|-------------|
| `src/server.js` | Punto de entrada - levanta el servidor Express en el puerto configurado |
| `src/app.js` | Configuración de Express (middlewares globales, cors, rutas) |
| `src/config/database.js` | Conexión a PostgreSQL con Sequelize |
| `src/models/` | Modelos de datos (User, etc.) definidos con Sequelize ORM |
| `src/routes/` | Definición de endpoints de la API (auth, users, etc.) |
| `src/controllers/` | Lógica de cada endpoint (recibe request, devuelve response) |
| `src/middlewares/` | Middleware de autenticación JWT, roles, validación, errores |
| `src/services/` | Capa de lógica de negocio separada de los controladores |
| `src/utils/` | Funciones auxiliares (generación de token, helpers) |
| `.env` | Variables de entorno (puerto, DB, JWT secret) |

**Stack Backend:**

| Tecnología | Uso |
|------------|-----|
| Node.js 18+ | Runtime de JavaScript en el servidor |
| Express.js 4 | Framework para crear la API REST |
| Sequelize 6 | ORM para interactuar con la base de datos |
| PostgreSQL 14+ | Base de datos relacional |
| jsonwebtoken (JWT) | Generación y verificación de tokens de autenticación |
| bcrypt | Encriptación de contraseñas (hash + salt) |
| dotenv | Carga de variables de entorno desde .env |
| cors | Permite peticiones del frontend al backend (Cross-Origin) |
| morgan | Logger de peticiones HTTP en consola |
| express-validator | Validación de datos en los endpoints |
| nodemon | Reinicio automático del servidor en desarrollo |

---

## 🔄 Cómo se Conectan Frontend y Backend

```
┌──────────────────┐          HTTP / JSON          ┌──────────────────┐
│                  │ ───────────────────────────▶  │                  │
│    FRONTEND      │    GET / POST / PUT / DELETE   │     BACKEND      │
│   (React SPA)    │ ◀───────────────────────────  │   (Express API)  │
│   Puerto 5173    │         Responses JSON         │   Puerto 3001    │
│                  │                                │                  │
└──────────────────┘                                └────────┬─────────┘
                                                             │
                                                             │ Sequelize
                                                             ▼
                                                    ┌──────────────────┐
                                                    │   POSTGRESQL     │
                                                    │   Puerto 5432    │
                                                    └──────────────────┘
```

---

## 🛠️ Stack Completo del Proyecto

```
┌─────────────────────────────────────────────────────────────────┐
│                        NORTE PROGET                               │
├─────────────────────────────┬───────────────────────────────────┤
│         FRONTEND            │           BACKEND                  │
├─────────────────────────────┼───────────────────────────────────┤
│  React 18                   │  Node.js 18+                      │
│  Vite 5                     │  Express.js 4                     │
│  React Router DOM 6         │  Sequelize 6 (ORM)                │
│  Tailwind CSS 3             │  PostgreSQL 14+                   │
│  Axios                      │  JWT (jsonwebtoken)               │
│  React Hook Form            │  bcrypt                           │
│  jwt-decode                 │  cors + morgan                    │
│  React Toastify             │  express-validator                │
│  React Icons                │  dotenv                           │
└─────────────────────────────┴───────────────────────────────────┘
```

---

## 🔀 Estrategia de Branches

| Branch | Propósito |
|--------|-----------|
| `GrupalPrincipal` | Producción - versión estable y desplegada |
| `main` | Staging / Pre-producción - pruebas finales |
| `developers` | Desarrollo activo del equipo |
| `feature/*` | Features individuales (ej: feature/login, feature/dashboard) |
| `fix/*` | Corrección de bugs |

```
GrupalPrincipal (producción)
    │
    ├── main (staging)
    │     │
    │     └── developers (desarrollo)
    │           │
    │           ├── feature/auth
    │           ├── feature/dashboard
    │           ├── feature/navbar
    │           └── fix/bug-name
```

---

## 🚀 Quick Start

```bash
# Clonar el repositorio
git clone https://github.com/gaby28894178/NorteProget.git
cd NorteProget

# --- Terminal 1: Backend ---
cd backend
npm install
# Configurar .env con datos de PostgreSQL
npm run dev
# Servidor corriendo en http://localhost:3001

# --- Terminal 2: Frontend ---
cd frontend
npm install
# Configurar .env con URL del backend
npm run dev
# App corriendo en http://localhost:5173
```

---

## 👥 Equipo

Proyecto desarrollado siguiendo roles Scrum:

| Rol | Responsabilidad |
|-----|-----------------|
| PM / Scrum Master | Gestión del proyecto, sprints, dailys |
| UI/UX Designer | Diseño de interfaces y experiencia de usuario |
| Frontend Developers | Desarrollo de la SPA con React |
| Backend Developers | Desarrollo de la API REST |
| DevOps | Infraestructura, CI/CD, despliegue |
| QA / Testers | Pruebas funcionales y de calidad |
| Data Analyst | Análisis de datos y métricas |
| Marketing Digital | Estrategia digital y comunicación |
| Soporte IT | Soporte técnico al equipo |

---

## 📄 Documentación del Proyecto

| Archivo | Contenido |
|---------|-----------|
| `01-NORTE-Brief-del-Proyecto.docx` | Brief general del proyecto |
| `02-NORTE-Guia-PM-Scrum-Master.docx` | Guía para el PM |
| `03-NORTE-Guia-UI-UX.docx` | Guía de diseño UI/UX |
| `04-NORTE-Guia-Frontend.docx` | Guía para desarrolladores frontend |
| `05-NORTE-Guia-Backend.docx` | Guía para desarrolladores backend |
| `06-NORTE-Guia-DevOps.docx` | Guía DevOps |
| `07-NORTE-Guia-QA-Testers.docx` | Guía para QA y testers |
| `08-NORTE-Guia-Data-Analyst.docx` | Guía Data Analyst |
| `09-NORTE-Guia-Marketing-Digital.docx` | Guía Marketing Digital |
| `10-NORTE-Guia-Soporte-IT.docx` | Guía Soporte IT |

---

## 📝 Licencia

Proyecto privado - NorteProget © 2026
