import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { env } from './core/config/env.js';
import { corsConfig } from './core/config/cors.js';
import { setupSwagger } from './core/config/swagger.js';
import { connectDatabase } from './database/database.js';
import { errorHandler } from './core/middlewares/error-handler.js';

const app = express();

// Middlewares globales
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

setupSwagger(app);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
  });
});

app.use(errorHandler);

await connectDatabase();

// Iniciar servidor
app.listen(env.port, () => {
  console.log(
    `Servidor ejecutándose en el puerto http://localhost:${env.port}`,
  );
});
