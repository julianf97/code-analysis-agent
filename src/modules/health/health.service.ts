import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  getHealth() {
    return { status: 'ok' };
  }

  async checkDependencies() {
    await this.dataSource.query('SELECT 1');
    return { status: 'ok', postgres: 'available', orm: 'typeorm' };
  }
}
