import express from 'express';
import { healthRoutes } from './routes/health.routes.js';
import repositoryRoutes from './routes/repository.routes.js';
import { requireAdmin } from './middlewares/auth.middleware.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '256kb' }));
  app.use('/health', healthRoutes);
  app.use('/api', requireAdmin);
  app.use('/api/repositories', repositoryRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
