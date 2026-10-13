import { Router } from 'express';
import {
  createRepository,
  listRepositoriesController,
  getRepositoryController,
} from '../controllers/repository.controller.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

const router = Router();

router.get('/', asyncHandler(listRepositoriesController));
router.get('/:id', asyncHandler(getRepositoryController));
router.post('/', asyncHandler(createRepository));

export default router;
