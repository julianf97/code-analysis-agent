import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { loadEnvironment } from '../config/env.js';

const config = loadEnvironment();

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: 'postgres',
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  },
);

async function initializeDatabase() {
  await sequelize.authenticate();
  // Los modelos solo describen el esquema; las tablas se crean mediante migraciones.
  await import('../models/index.js');
}

export { initializeDatabase, sequelize };
