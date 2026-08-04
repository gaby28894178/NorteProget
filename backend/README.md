# 🚀 NorteProget - Backend

## 📋 Descripción del Proyecto

**NorteProget** es una plataforma digital desarrollada bajo metodología Scrum. Este repositorio contiene el servidor backend (API REST) que gestiona la lógica de negocio, autenticación, autorización y conexión a base de datos.

---

## 🏗️ Arquitectura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración y conexión a PostgreSQL
│   │   └── config.js            # Variables de entorno
│   ├── controllers/
│   │   ├── authController.js    # Login, Register, Logout
│   │   ├── userController.js    # CRUD de usuarios
│   │   └── ...Controller.js     # Otros controladores
│   ├── middlewares/
│   │   ├── authMiddleware.js    # Verificación JWT
│   │   ├── roleMiddleware.js   # Control de roles
│   │   ├── errorHandler.js      # Manejo global de errores
│   │   └── validateRequest.js   # Validación de datos
│   ├── models/
│   │   ├── User.js              # Modelo de Usuario
│   │   ├── index.js             # Asociaciones entre modelos
│   │   └── ...Model.js          # Otros modelos
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   ├── userRoutes.js        # Rutas de usuarios
│   │   └── index.js             # Agrupador de rutas
│   ├── services/
│   │   └── ...Service.js        # Lógica de negocio
│   ├── utils/
│   │   ├── generateToken.js     # Generación de JWT
│   │   └── helpers.js           # Funciones auxiliares
│   ├── app.js                   # Configuración de Express
│   └── server.js                # Punto de entrada del servidor
├── .env                         # Variables de entorno (NO subir a Git)
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express.js** | 4.x | Framework web / API REST |
| **Sequelize** | 6.x | ORM para base de datos |
| **PostgreSQL** | 14+ | Base de datos relacional |
| **JWT (jsonwebtoken)** | 9.x | Autenticación por tokens |
| **bcrypt** | 5.x | Encriptación de contraseñas |
| **dotenv** | 16.x | Variables de entorno |
| **cors** | 2.x | Manejo de CORS |
| **morgan** | 1.x | Logger HTTP |
| **express-validator** | 7.x | Validación de datos |

---

## 📦 Instalación

### Prerrequisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/gaby28894178/NorteProget.git

# 2. Ir a la carpeta backend
cd NorteProget/backend

# 3. Instalar dependencias
npm install

# 4. Copiar el archivo de variables de entorno
cp .env.example .env

# 5. Configurar las variables en .env (ver sección abajo)

# 6. Crear la base de datos en PostgreSQL
createdb norteproget_db

# 7. Ejecutar migraciones
npx sequelize-cli db:migrate

# 8. (Opcional) Ejecutar seeders
npx sequelize-cli db:seed:all

# 9. Iniciar el servidor
npm run dev
```

---

## ⚙️ Variables de Entorno (.env)

```env
# Server
PORT=3001
NODE_ENV=development

# Database - PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=norteproget_db
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_clave_secreta_segura
JWT_EXPIRES_IN=24h

# CORS
CLIENT_URL=http://localhost:3000
```

---

## 🔑 Dependencias a Instalar

```bash
# Dependencias principales
npm install express sequelize pg pg-hstore jsonwebtoken bcrypt dotenv cors morgan express-validator

# Dependencias de desarrollo
npm install -D nodemon sequelize-cli
```

---

## 🖥️ Scripts Disponibles

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "migrate": "npx sequelize-cli db:migrate",
    "seed": "npx sequelize-cli db:seed:all",
    "migrate:undo": "npx sequelize-cli db:migrate:undo:all"
  }
}
```

---

## 🔐 Flujo de Autenticación

```
┌─────────┐       ┌─────────────┐       ┌──────────┐
│  Client │──────▶│   Server    │──────▶│ Database │
└─────────┘       └─────────────┘       └──────────┘
     │                   │                     │
     │  POST /auth/register                    │
     │──────────────────▶│                     │
     │                   │  bcrypt.hash(pass)  │
     │                   │─────────────────────▶
     │                   │  User.create()      │
     │◀──────────────────│◀────────────────────│
     │  { token, user }  │                     │
     │                   │                     │
     │  POST /auth/login │                     │
     │──────────────────▶│                     │
     │                   │  bcrypt.compare()   │
     │                   │  jwt.sign()         │
     │◀──────────────────│                     │
     │  { token, user }  │                     │
     │                   │                     │
     │  GET /api/users   │                     │
     │  Header: Bearer   │                     │
     │──────────────────▶│                     │
     │                   │  jwt.verify()       │
     │                   │  middleware auth     │
     │                   │─────────────────────▶
     │◀──────────────────│◀────────────────────│
     │  { data }         │                     │
```

---

## 🗄️ Modelo de Base de Datos (Ejemplo)

```
┌────────────────────────┐
│        USERS           │
├────────────────────────┤
│ id (PK, UUID)          │
│ firstName (STRING)     │
│ lastName (STRING)      │
│ email (STRING, UNIQUE) │
│ password (STRING)      │
│ role (ENUM)            │
│ isActive (BOOLEAN)     │
│ createdAt (DATE)       │
│ updatedAt (DATE)       │
└────────────────────────┘
```

---

## 📡 Endpoints de la API

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |

### Users
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Obtener usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

---

## 🔀 Estrategia de Branching

```
GrupalPrincipal (producción)
    │
    ├── main (staging / pre-producción)
    │     │
    │     └── developers (desarrollo activo)
    │           │
    │           ├── feature/auth
    │           ├── feature/users
    │           └── fix/bug-name
```

---

## 👥 Equipo

- **PM / Scrum Master** - Gestión del proyecto
- **Backend Developers** - Desarrollo de API
- **DevOps** - Infraestructura y despliegue
- **QA / Testers** - Pruebas y calidad

---

## 📄 Documentación Adicional

Consultar los documentos del proyecto:
- `01-NORTE-Brief-del-Proyecto.docx` - Brief general
- `05-NORTE-Guia-Backend.docx` - Guía específica Backend
- `06-NORTE-Guia-DevOps.docx` - Guía DevOps
- `07-NORTE-Guia-QA-Testers.docx` - Guía QA

---

## 📝 Licencia

Proyecto privado - NorteProget © 2026
