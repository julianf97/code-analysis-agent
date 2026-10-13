import { Router } from 'express';
import { getPool } from '../../db/pool.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

export const healthRoutes = Router();

healthRoutes.get('/', (_req, res) => res.json({ status: 'ok' }));
healthRoutes.get('/dependencies', asyncHandler(async (_req, res) => {
  await getPool().query('SELECT 1');
  res.json({ status: 'ok', postgres: 'available' });
}));
