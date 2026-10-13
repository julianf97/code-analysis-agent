import {
  createRepository,
  findRepositories,
  findRepositoryById,
} from '../../db/repositories/repository.repository.js';
import type { RepositoryAttributes } from '../../models/repository.js';
import { AppError } from '../middlewares/error.middleware.js';

export async function registerRepository(data: Pick<RepositoryAttributes, 'owner' | 'name'>) {
  const [repository] = await createRepository(data);
  return repository;
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
