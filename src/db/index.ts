import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { loadEnvironment } from '../config/env.js';
import { createDatabaseOptions } from './database.options.js';

// Esta instancia la usa exclusivamente el script de migraciones.
// La API NestJS obtiene su propia conexión administrada por TypeOrmModule.
export const dataSource = new DataSource(createDatabaseOptions(loadEnvironment()));

export async function initializeDatabase(): Promise<DataSource> {
  if (!dataSource.isInitialized) await dataSource.initialize();
  return dataSource;
}

export async function closeDatabase(): Promise<void> {
  if (dataSource.isInitialized) await dataSource.destroy();
}
