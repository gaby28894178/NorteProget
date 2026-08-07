import 'dotenv/config';

const requiredEnv = [
  'DATABASE_URL',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

if (process.env.NODE_ENV === 'production') {
  requiredEnv.push('FRONTEND_URL');
}

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} no está configurado`);
  }
});

export const env = {
  port: Number(process.env.PORT) || 3002,

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  nodeEnv: process.env.NODE_ENV || 'development',

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  jwtExpiration: '7d',
};
