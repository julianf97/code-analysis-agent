import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { MigrationInterface, QueryRunner } from 'typeorm';

const requiredTables = [
  'repositories',
  'analysis_profiles',
  'analyses',
  'analysis_revisions',
  'analysis_jobs',
  'analysis_steps',
  'analysis_files',
  'analysis_findings',
  'analysis_reports',
  'analysis_messages',
  'llm_usage_events',
  'budget_reservations',
];

export class InitialSchema1760361000000 implements MigrationInterface {
  name = 'InitialSchema1760361000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DB_USE_TEST_SCHEMA === 'true'
      ? process.env.DB_TEST_SCHEMA
      : process.env.DB_SCHEMA || 'public';

    if (schema !== 'public') {
      throw new Error('El DDL histórico solo soporta el schema public; no se modificaron datos.');
    }

    const existing = await Promise.all(requiredTables.map(table => queryRunner.hasTable(table)));
    if (existing.every(Boolean)) {
      // Adopta de manera no destructiva el esquema ya creado por Sequelize/Umzug.
      // El historial de TypeORM se registra al terminar esta migración.
      return;
    }
    if (existing.some(Boolean)) {
      throw new Error('Esquema parcial detectado. Revisá las tablas antes de ejecutar una migración.');
    }

    const sql = await readFile(resolve(process.cwd(), 'migrations/001_initial.sql'), 'utf8');
    await queryRunner.query(sql);
  }

  async down(): Promise<void> {
    throw new Error('La migración inicial no se revierte destruyendo datos. Creá una migración correctiva.');
  }
}
