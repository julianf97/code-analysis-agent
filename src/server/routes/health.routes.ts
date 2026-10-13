import { Router } from 'express';
import { getSequelize } from '../../db/sequelize.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

export const healthRoutes = Router();

healthRoutes.get('/', (_req, res) => res.json({ status: 'ok' }));
healthRoutes.get('/dependencies', asyncHandler(async (_req, res) => {
  await getSequelize().authenticate();
  res.json({ status: 'ok', postgres: 'available', orm: 'sequelize' });
}));
