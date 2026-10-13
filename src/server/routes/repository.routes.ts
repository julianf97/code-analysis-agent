import { Router } from 'express';
import { RepositoryController } from '../controllers/repository.controller.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

const controller = new RepositoryController();
export const repositoryRoutes = Router();

repositoryRoutes.get('/', asyncHandler(controller.list));
repositoryRoutes.get('/:id', asyncHandler(controller.detail));
repositoryRoutes.post('/', asyncHandler(controller.create));
