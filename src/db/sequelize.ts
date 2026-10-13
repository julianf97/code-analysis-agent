import { Sequelize } from 'sequelize';
import { loadEnvironment } from '../config/env.js';

let instance: Sequelize | undefined;

export function getSequelize(): Sequelize {
  if (!instance) {
    instance = new Sequelize(loadEnvironment().DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
      define: { freezeTableName: true },
    });
  }
  return instance;
}

export async function closeSequelize(): Promise<void> {
  if (instance) {
    await instance.close();
    instance = undefined;
  }
}
