import {
  createRepository,
  findRepositories,
  findRepositoryById,
} from '../../db/repositories/repository.repository.js';
import type { Repository } from '../../models/repository.js';
import { AppError } from '../middlewares/error.middleware.js';

export function registerRepository(data: Pick<Repository, 'owner' | 'name'>) {
  return createRepository(data);
}

export function listRepositories() {
  return findRepositories();
}

export async function getRepositoryById(id: string) {
  const repository = await findRepositoryById(id);
  if (!repository) {
    throw new AppError(404, 'REPOSITORY_NOT_FOUND', 'Repositorio no registrado');
  }
  return repository;
}
