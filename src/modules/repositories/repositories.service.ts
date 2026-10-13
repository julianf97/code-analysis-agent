import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoriesRepository } from './repositories.repository.js';
import type { CreateRepositoryDto } from './dto/create-repository.dto.js';

@Injectable()
export class RepositoriesService {
  constructor(private readonly repositoriesRepository: RepositoriesRepository) {}

  register(data: CreateRepositoryDto) {
    return this.repositoriesRepository.create(data);
  }

  list() {
    return this.repositoriesRepository.findAll();
  }

  async findById(id: string) {
    const repository = await this.repositoriesRepository.findById(id);

    if (!repository) {
      throw new NotFoundException({
        error: {
          code: 'REPOSITORY_NOT_FOUND',
          message: 'Repositorio no registrado',
        },
      });
    }

    return repository;
  }
}
