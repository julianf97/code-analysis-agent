import Repository, { type RepositoryAttributes } from '../../models/repository.js';

export function findRepositories() {
  return Repository.findAll({
    order: [['createdAt', 'DESC']],
  });
}

export function findRepositoryById(id: string) {
  return Repository.findByPk(id);
}

export function createRepository(data: Pick<RepositoryAttributes, 'owner' | 'name'>) {
  return Repository.findOrCreate({
    where: {
      provider: 'github',
      owner: data.owner,
      name: data.name,
    },
    defaults: {
      provider: 'github',
      owner: data.owner,
      name: data.name,
    },
  });
}
