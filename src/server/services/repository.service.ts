import { RepositoryRepository } from '../../db/repositories/repository.repository.js';
import { AppError } from '../middlewares/error.middleware.js';
import type { RegisterRepositoryInput } from '../../db/repositories/repository.repository.js';

export class RepositoryService {
  constructor(private readonly repository = new RepositoryRepository()) {}

  async register(input: RegisterRepositoryInput) {
    return this.repository.create(input);
  }

  async list() {
    return this.repository.findAll();
  }

  async find(id: string) {
    const repository = await this.repository.findById(id);
    if (!repository) throw new AppError(404, 'REPOSITORY_NOT_FOUND', 'Repositorio no registrado');
    return repository;
  }
}
