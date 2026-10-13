import { Router } from 'express';
import { sequelize } from '../../db/index.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

export const healthRoutes = Router();

healthRoutes.get('/', (_req, res) => res.json({ status: 'ok' }));
healthRoutes.get('/dependencies', asyncHandler(async (_req, res) => {
  await sequelize.authenticate();
  res.json({ status: 'ok', postgres: 'available', orm: 'sequelize' });
}));
