import { env } from './env.js';

const allowedOrigins = [
  env.frontendUrl,
  'http://localhost:3002',
  'http://127.0.0.1:3002',
];

export const corsConfig = {
  origin: (origin, callback) => {
    // Permitir requests sin Origin (curl, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Origin no permitido por CORS'));
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],
};
