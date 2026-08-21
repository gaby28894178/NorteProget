import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Norte API',
      version: '1.0.0',
      description: 'API REST del e-commerce NORTE',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3002',
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/auth/*.js', './src/modules/users/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
