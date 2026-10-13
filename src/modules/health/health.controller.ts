import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service.js';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Comprueba que la API está encendida' })
  @ApiOkResponse({ schema: { example: { status: 'ok' } } })
  getHealth() {
    return this.healthService.getHealth();
  }

  @Get('dependencies')
  @ApiOperation({ summary: 'Comprueba la conexión TypeORM a PostgreSQL' })
  @ApiOkResponse({ schema: { example: { status: 'ok', postgres: 'available', orm: 'typeorm' } } })
  checkDependencies() {
    return this.healthService.checkDependencies();
  }
}
