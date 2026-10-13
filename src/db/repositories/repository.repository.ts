import { getModels } from '../models/index.js';

export interface RegisterRepositoryInput {
  owner: string;
  name: string;
}

export class RepositoryRepository {
  async create(input: RegisterRepositoryInput) {
    const { Repository } = getModels();
    const [repository] = await Repository.findOrCreate({
      where: { provider: 'github', owner: input.owner, name: input.name },
      defaults: { ...input, provider: 'github' },
    });
    return repository;
  }

  async findAll() {
    return getModels().Repository.findAll({ order: [['created_at', 'DESC']] });
  }

  async findById(id: string) {
    return getModels().Repository.findByPk(id);
  }
}
