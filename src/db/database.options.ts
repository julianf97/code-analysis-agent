import type { DataSourceOptions } from 'typeorm';
import type { Environment } from '../config/env.js';
import {
  Repository,
  Analysis,
  AnalysisJob,
  AnalysisProfile,
  AnalysisRevision,
  AnalysisStep,
  AnalysisFile,
  AnalysisFinding,
  AnalysisReport,
  AnalysisMessage,
  LlmUsageEvent,
  BudgetReservation,
} from '../models/index.js';
import { InitialSchema1760361000000 } from './migrations/1760361000000-initial-schema.js';

export function createDatabaseOptions(config: Environment): DataSourceOptions {
  return {
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    schema: config.DB_USE_TEST_SCHEMA === 'true' ? config.DB_TEST_SCHEMA : config.DB_SCHEMA,
    installExtensions: false,
    synchronize: false,
    migrationsRun: false,
    migrationsTableName: 'typeorm_migrations',
    logging: false,
    entities: [
      Repository,
      Analysis,
      AnalysisJob,
      AnalysisProfile,
      AnalysisRevision,
      AnalysisStep,
      AnalysisFile,
      AnalysisFinding,
      AnalysisReport,
      AnalysisMessage,
      LlmUsageEvent,
      BudgetReservation,
    ],
    migrations: [InitialSchema1760361000000],
  };
}
