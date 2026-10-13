import { Router } from 'express';
import { dataSource } from '../../db/index.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

export const healthRoutes = Router();

healthRoutes.get('/', (_req, res) => res.json({ status: 'ok' }));
healthRoutes.get('/dependencies', asyncHandler(async (_req, res) => {
  if (!dataSource.isInitialized) throw new Error('Conexión con PostgreSQL no inicializada');
  await dataSource.query('SELECT 1');
  res.json({ status: 'ok', postgres: 'available', orm: 'typeorm' });
}));
