import { dataSource } from '../index.js';
import { Repository } from '../../models/repository.js';

export function findRepositories() {
  return dataSource.getRepository(Repository).find({
    order: { createdAt: 'DESC' },
  });
}

export function findRepositoryById(id: string) {
  return dataSource.getRepository(Repository).findOneBy({ id });
}

export async function createRepository(data: Pick<Repository, 'owner' | 'name'>) {
  const repository = dataSource.getRepository(Repository);

  await repository.upsert({
    provider: 'github',
    owner: data.owner,
    name: data.name,
  }, ['provider', 'owner', 'name']);

  return repository.findOneByOrFail({
    provider: 'github',
    owner: data.owner,
    name: data.name,
  });
}
