import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyGuard } from '../../auth/api-key.guard.js';
import { Repository } from '../../models/repository.js';
import { RepositoriesController } from './repositories.controller.js';
import { RepositoriesRepository } from './repositories.repository.js';
import { RepositoriesService } from './repositories.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Repository])],
  controllers: [RepositoriesController],
  providers: [
    ApiKeyGuard,
    RepositoriesService,
    RepositoriesRepository,
  ],
  exports: [RepositoriesService],
})
export class RepositoriesModule {}
