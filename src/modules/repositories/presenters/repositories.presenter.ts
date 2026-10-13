import type { Repository } from '../../../models/repository.js';
import type { RepositoryResponseDto } from '../dto/repository-response.dto.js';

export function toRepositoryResponse(repository: Repository): RepositoryResponseDto {
  return {
    id: repository.id,
    provider: repository.provider,
    owner: repository.owner,
    name: repository.name,
    createdAt: repository.createdAt,
  };
}
