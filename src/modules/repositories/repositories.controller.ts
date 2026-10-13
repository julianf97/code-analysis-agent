import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../../auth/api-key.guard.js';
import { CreateRepositoryDto } from './dto/create-repository.dto.js';
import {
  RepositoryDataResponseDto,
  RepositoriesDataResponseDto,
} from './dto/repository-response.dto.js';
import { toRepositoryResponse } from './presenters/repositories.presenter.js';
import { RepositoriesService } from './repositories.service.js';

@ApiTags('Repositories')
@ApiSecurity('admin-api-key')
@UseGuards(ApiKeyGuard)
@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los repositorios registrados' })
  @ApiOkResponse({ type: RepositoriesDataResponseDto })
  async list(): Promise<RepositoriesDataResponseDto> {
    const repositories = await this.repositoriesService.list();
    return { data: repositories.map(toRepositoryResponse) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un repositorio por su identificador' })
  @ApiOkResponse({ type: RepositoryDataResponseDto })
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<RepositoryDataResponseDto> {
    const repository = await this.repositoriesService.findById(id);
    return { data: toRepositoryResponse(repository) };
  }

  @Post()
  @ApiOperation({ summary: 'Registra un repositorio para futuros análisis' })
  @ApiCreatedResponse({ type: RepositoryDataResponseDto })
  async register(@Body() body: CreateRepositoryDto): Promise<RepositoryDataResponseDto> {
    const repository = await this.repositoriesService.register(body);
    return { data: toRepositoryResponse(repository) };
  }
}
