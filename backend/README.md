# 🚀 NORTE - Backend

## 📋 Descripción

Backend de **NORTE**, un MVP de e-commerce desarrollado como parte de la **Simulación Laboral Tech** de ID For Ideas.

La aplicación expone una API REST responsable de la autenticación, la lógica de negocio y el acceso a la base de datos que soportan la plataforma.

---

# 🛠️ Stack Tecnológico

| Tecnología        | Uso                           |
| ----------------- | ----------------------------- |
| Node.js           | Runtime de JavaScript         |
| Express.js        | Framework para API REST       |
| PostgreSQL        | Base de datos relacional      |
| Sequelize         | ORM                           |
| JWT               | Autenticación mediante tokens |
| bcrypt            | Hash de contraseñas           |
| express-validator | Validación de datos           |
| dotenv            | Variables de entorno          |
| cors              | Configuración de CORS         |
| morgan            | Logging HTTP                  |

---

# 🏗️ Arquitectura

El proyecto utiliza una **arquitectura modular orientada por funcionalidades (Feature-Based Architecture)**.

Cada módulo agrupa todos los elementos necesarios para implementar una capacidad del negocio:

- Modelos
- Repositorios
- Servicios
- Controladores
- Validaciones
- Rutas

Esta organización facilita el mantenimiento, la escalabilidad y el trabajo colaborativo.

---

# 📁 Estructura del Proyecto

```

backend/
│
├── src/
│   │
│   ├── main.js                   # Punto de entrada de la aplicación
│   │
│   ├── core/
│   │   ├── config/
│   │   │   ├── env.js            # Variables de entorno
│   │   │   ├── cors.js           # Configuración de CORS
│   │   │   ├── swagger.js        # Configuración de Swagger/OpenAPI
│   │   │   ├── logger.js         # Configuración del logger
│   │   │   └── routes.js         # Registro centralizado de las rutas
│   │   │
│   │   ├── constants/            # Constantes globales
│   │   ├── errors/               # Manejo centralizado de errores
│   │   ├── middlewares/          # Middlewares compartidos
│   │   ├── utils/                # Funciones auxiliares
│   │   └── validators/           # Validaciones reutilizables
│   │
│   ├── database/
│   │   ├── database.js           # Conexión e inicialización de Sequelize
│   │   ├── migrations/
│   │   └── seeders/
│   │
│   └── modules/
│   │
│   ├── auth/
│   │
│   ├── users/
│   │   ├── user.model.js
│   │   ├── user.repository.js
│   │   ├── user.service.js
│   │   ├── user.controller.js
│   │   ├── user.validation.js
│   │   └── routes.js
│   │
│   ├── categories/
│   ├── products/
│   ├── carts/
│   ├── orders/
│   ├── payments/
│   ├── faq/
│   └── business/
│
├── .env.example
├── package.json
└── README.md

```

---

# 📦 Módulos

| Módulo     | Responsabilidad                                                   |
| ---------- | ----------------------------------------------------------------- |
| Auth       | Autenticación y autorización                                      |
| Users      | Gestión de usuarios                                               |
| Categories | Gestión de categorías                                             |
| Products   | Productos, variantes e imágenes                                   |
| Carts      | Carrito de compras                                                |
| Orders     | Gestión de pedidos                                                |
| Payments   | Gestión e integración de pagos                                    |
| FAQ        | Preguntas frecuentes                                              |
| Business   | Configuración del negocio (WhatsApp, información comercial, etc.) |

---

# 🚀 Instalación

## Prerrequisitos

- Node.js
- PostgreSQL
- npm

## Pasos

```bash
git clone <repository-url>

cd backend

npm install

cp .env.example .env

npm run dev
```

---

# ⚙️ Variables de Entorno

El proyecto incluye un archivo **`.env.example`** con todas las variables necesarias.

Crear una copia llamada **`.env`** y completar los valores correspondientes al entorno local.

---

# 🖥️ Scripts

| Script                 | Descripción                           |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Inicia el servidor en modo desarrollo |
| `npm start`            | Inicia el servidor en producción      |
| `npm run migrate`      | Ejecuta las migraciones               |
| `npm run seed`         | Ejecuta los seeders                   |
| `npm run migrate:undo` | Revierte las migraciones              |

---

# 📐 Convenciones

- Arquitectura modular orientada por funcionalidades.
- Cada módulo representa un dominio del negocio.
- Los **Controllers** gestionan las solicitudes y respuestas HTTP.
- Los **Services** contienen la lógica de negocio.
- Los **Repositories** encapsulan el acceso a la base de datos.
- Los **Models** representan las entidades mediante Sequelize.
- Cada módulo define sus propias rutas en `routes.js`.
- Las rutas se registran de forma centralizada desde `main.js`.
- Las validaciones utilizan **express-validator**.

---

# 📄 Licencia

Proyecto desarrollado con fines educativos como parte de la **Simulación Laboral Tech** de **ID For Ideas**.
