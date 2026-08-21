import { Sequelize } from 'sequelize';
import { env } from '../core/config/env.js';

const sequelize = new Sequelize(env.databaseUrl, {
  dialect: 'postgres',
  logging: false,
});

export const connectDatabase = async () => {
  try {
    await sequelize.sync();

    console.log('✅ Conexión a PostgreSQL establecida');
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error);
    throw error;
  }
};

export default sequelize;
