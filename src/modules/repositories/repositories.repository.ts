import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from '../../models/repository.js';
import type { CreateRepositoryDto } from './dto/create-repository.dto.js';

@Injectable()
export class RepositoriesRepository {
  constructor(
    @InjectRepository(Repository)
    private readonly repository: TypeOrmRepository<Repository>,
  ) {}

  findAll(): Promise<Repository[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Repository | null> {
    return this.repository.findOneBy({ id });
  }

  async create(data: CreateRepositoryDto): Promise<Repository> {
    await this.repository.upsert({
      provider: 'github',
      owner: data.owner,
      name: data.name,
    }, ['provider', 'owner', 'name']);

    return this.repository.findOneByOrFail({
      provider: 'github',
      owner: data.owner,
      name: data.name,
    });
  }
}
