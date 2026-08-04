# 🚀 NorteProget - Frontend

## 📋 Descripción del Proyecto

**NorteProget** es una plataforma digital desarrollada bajo metodología Scrum. Este repositorio contiene el cliente frontend (SPA) que gestiona la interfaz de usuario, navegación, consumo de API y experiencia del usuario.

---

## 🏗️ Arquitectura del Proyecto

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       └── images/
├── src/
│   ├── api/
│   │   ├── axiosConfig.js       # Configuración base de Axios
│   │   ├── authApi.js           # Llamadas API de autenticación
│   │   └── userApi.js           # Llamadas API de usuarios
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx       # Barra de navegación
│   │   │   ├── Footer.jsx       # Pie de página
│   │   │   ├── Loader.jsx       # Spinner de carga
│   │   │   └── Button.jsx       # Botón reutilizable
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx    # Formulario de login
│   │   │   └── RegisterForm.jsx # Formulario de registro
│   │   └── layout/
│   │       ├── MainLayout.jsx   # Layout principal
│   │       └── AuthLayout.jsx   # Layout de autenticación
│   ├── context/
│   │   └── AuthContext.jsx      # Contexto de autenticación
│   ├── hooks/
│   │   ├── useAuth.js           # Hook de autenticación
│   │   └── useFetch.js          # Hook para peticiones
│   ├── pages/
│   │   ├── Home.jsx             # Página principal
│   │   ├── Login.jsx            # Página de login
│   │   ├── Register.jsx         # Página de registro
│   │   ├── Dashboard.jsx        # Panel de control
│   │   ├── Profile.jsx          # Perfil de usuario
│   │   └── NotFound.jsx         # Página 404
│   ├── router/
│   │   ├── AppRouter.jsx        # Router principal
│   │   └── PrivateRoute.jsx     # Rutas protegidas
│   ├── styles/
│   │   ├── globals.css          # Estilos globales
│   │   └── variables.css        # Variables CSS
│   ├── utils/
│   │   ├── constants.js         # Constantes de la app
│   │   └── helpers.js           # Funciones auxiliares
│   ├── App.jsx                  # Componente raíz
│   └── main.jsx                 # Punto de entrada
├── .env                         # Variables de entorno (NO subir a Git)
├── .env.example                 # Ejemplo de variables
├── .gitignore
├── index.html
├── package.json
├── vite.config.js               # Configuración de Vite
├── tailwind.config.js           # Configuración de Tailwind
├── postcss.config.js            # Configuración de PostCSS
└── README.md
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 18.x | Librería UI (SPA) |
| **Vite** | 5.x | Bundler / Dev Server |
| **React Router DOM** | 6.x | Enrutamiento SPA |
| **Axios** | 1.x | Cliente HTTP para API |
| **Tailwind CSS** | 3.x | Framework de estilos |
| **React Hook Form** | 7.x | Manejo de formularios |
| **React Toastify** | 9.x | Notificaciones |
| **React Icons** | 4.x | Iconos |
| **jwt-decode** | 4.x | Decodificar tokens JWT |
| **Zustand** o **Context API** | - | Manejo de estado global |

---

## 📦 Instalación

### Prerrequisitos

- Node.js >= 18
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/gaby28894178/NorteProget.git

# 2. Ir a la carpeta frontend
cd NorteProget/frontend

# 3. Instalar dependencias
npm install

# 4. Copiar el archivo de variables de entorno
cp .env.example .env

# 5. Configurar la URL del backend en .env

# 6. Iniciar el servidor de desarrollo
npm run dev
```

---

## ⚙️ Variables de Entorno (.env)

```env
# API Backend URL
VITE_API_URL=http://localhost:3001/api

# App
VITE_APP_NAME=NorteProget
```

---

## 🔑 Dependencias a Instalar

```bash
# Crear proyecto con Vite
npm create vite@latest frontend -- --template react

# Dependencias principales
npm install react-router-dom axios react-hook-form react-toastify react-icons jwt-decode

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Dependencias de desarrollo
npm install -D eslint prettier eslint-plugin-react
```

---

## 🖥️ Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.jsx"
  }
}
```

---

## 🎨 Maqueta de Interfaz (Wireframe Ilustrativo)

### Página de Login

```
┌─────────────────────────────────────────────────────┐
│                    NORTE PROGET                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│         ┌─────────────────────────────┐             │
│         │        INICIAR SESIÓN       │             │
│         ├─────────────────────────────┤             │
│         │                             │             │
│         │  ┌───────────────────────┐  │             │
│         │  │ 📧 Email              │  │             │
│         │  └───────────────────────┘  │             │
│         │                             │             │
│         │  ┌───────────────────────┐  │             │
│         │  │ 🔒 Contraseña         │  │             │
│         │  └───────────────────────┘  │             │
│         │                             │             │
│         │  ┌───────────────────────┐  │             │
│         │  │    INICIAR SESIÓN     │  │             │
│         │  └───────────────────────┘  │             │
│         │                             │             │
│         │  ¿No tienes cuenta?         │             │
│         │  Regístrate aquí            │             │
│         └─────────────────────────────┘             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Dashboard Principal

```
┌─────────────────────────────────────────────────────┐
│ 🟢 NorteProget    │ Home │ Dashboard │ Perfil │ 🚪  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ 📊      │  │ 👥      │  │ 📈      │            │
│  │ Card 1  │  │ Card 2  │  │ Card 3  │            │
│  │ Info    │  │ Usuarios│  │ Stats   │            │
│  └─────────┘  └─────────┘  └─────────┘            │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │              TABLA DE DATOS                    │   │
│  ├──────┬──────────┬──────────┬─────────────────┤   │
│  │  ID  │  Nombre  │  Email   │   Acciones      │   │
│  ├──────┼──────────┼──────────┼─────────────────┤   │
│  │  1   │  User 1  │  u1@..   │  ✏️ 🗑️         │   │
│  │  2   │  User 2  │  u2@..   │  ✏️ 🗑️         │   │
│  │  3   │  User 3  │  u3@..   │  ✏️ 🗑️         │   │
│  └──────┴──────────┴──────────┴─────────────────┘   │
│                                                      │
│  ◀ 1 2 3 ... ▶                                      │
│                                                      │
├─────────────────────────────────────────────────────┤
│  © 2024 NorteProget - Todos los derechos reservados │
└─────────────────────────────────────────────────────┘
```

### Página de Registro

```
┌─────────────────────────────────────────────────────┐
│                    NORTE PROGET                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│         ┌─────────────────────────────┐             │
│         │         REGISTRO            │             │
│         ├─────────────────────────────┤             │
│         │                             │             │
│         │  ┌───────────────────────┐  │             │
│         │  │ 👤 Nombre             │  │             │
│         │  └───────────────────────┘  │             │
│         │  ┌───────────────────────┐  │             │
│         │  │ 👤 Apellido           │  │             │
│         │  └───────────────────────┘  │             │
│         │  ┌───────────────────────┐  │             │
│         │  │ 📧 Email              │  │             │
│         │  └───────────────────────┘  │             │
│         │  ┌───────────────────────┐  │             │
│         │  │ 🔒 Contraseña         │  │             │
│         │  └───────────────────────┘  │             │
│         │  ┌───────────────────────┐  │             │
│         │  │ 🔒 Confirmar Pass     │  │             │
│         │  └───────────────────────┘  │             │
│         │                             │             │
│         │  ┌───────────────────────┐  │             │
│         │  │      REGISTRARSE      │  │             │
│         │  └───────────────────────┘  │             │
│         │                             │             │
│         │  ¿Ya tienes cuenta?         │             │
│         │  Inicia sesión aquí         │             │
│         └─────────────────────────────┘             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🧭 Navegación y Rutas

```
┌─────────────────────────────────────────┐
│              APP ROUTER                  │
├─────────────────────────────────────────┤
│                                          │
│  Públicas:                               │
│  ├── /              → Home               │
│  ├── /login         → Login              │
│  └── /register      → Register           │
│                                          │
│  Privadas (requieren token):             │
│  ├── /dashboard     → Dashboard          │
│  ├── /profile       → Perfil             │
│  └── /users         → Lista Usuarios     │
│                                          │
│  Error:                                  │
│  └── /*             → NotFound (404)     │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🔐 Flujo de Autenticación (Frontend)

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────▶│  API     │────▶│  Token   │
│  Form    │     │  Call    │     │  Store   │
└──────────┘     └──────────┘     └──────────┘
                                       │
                                       ▼
                              ┌──────────────┐
                              │  localStorage │
                              │  + Context    │
                              └──────────────┘
                                       │
                                       ▼
                              ┌──────────────┐
                              │  PrivateRoute │
                              │  (protegida) │
                              └──────────────┘
                                       │
                                       ▼
                              ┌──────────────┐
                              │  Dashboard   │
                              └──────────────┘
```

---

## 🎯 Componentes Principales

| Componente | Tipo | Descripción |
|------------|------|-------------|
| `Navbar` | Layout | Barra de navegación superior |
| `Footer` | Layout | Pie de página |
| `LoginForm` | Auth | Formulario de inicio de sesión |
| `RegisterForm` | Auth | Formulario de registro |
| `PrivateRoute` | Router | Protección de rutas privadas |
| `Loader` | UI | Indicador de carga |
| `Button` | UI | Botón reutilizable |
| `Card` | UI | Tarjeta de información |

---

## 🔀 Estrategia de Branching

```
GrupalPrincipal (producción)
    │
    ├── main (staging / pre-producción)
    │     │
    │     └── developers (desarrollo activo)
    │           │
    │           ├── feature/login-page
    │           ├── feature/dashboard
    │           ├── feature/navbar
    │           └── fix/bug-name
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

Proyecto privado - NorteProget © 2024
