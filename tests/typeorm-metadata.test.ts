import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import { getMetadataArgsStorage } from 'typeorm';
import {
  Repository, Analysis, AnalysisJob, AnalysisProfile,
  AnalysisRevision, AnalysisStep, AnalysisFile, AnalysisFinding,
  AnalysisReport, AnalysisMessage, LlmUsageEvent, BudgetReservation,
} from '../src/models/index.js';

const models = [
  Repository, Analysis, AnalysisJob, AnalysisProfile,
  AnalysisRevision, AnalysisStep, AnalysisFile, AnalysisFinding,
  AnalysisReport, AnalysisMessage, LlmUsageEvent, BudgetReservation,
];

test('Las doce entidades tienen una tabla TypeORM registrada', () => {
  const tableMetadata = getMetadataArgsStorage().tables;
  for (const model of models) {
    assert.ok(tableMetadata.some(table => table.target === model), model.name);
  }
});

test('Las relaciones principales se declaran en los modelos', () => {
  const relations = getMetadataArgsStorage().relations;
  assert.ok(relations.some(item => item.target === Analysis && item.propertyName === 'repository'));
  assert.ok(relations.some(item => item.target === AnalysisJob && item.propertyName === 'analysis'));
  assert.ok(relations.some(item => item.target === AnalysisFinding && item.propertyName === 'analysis'));
});

test('Se conserva la clave compuesta de las revisiones', () => {
  const columns = getMetadataArgsStorage().columns.filter(column => column.target === AnalysisRevision);
  const primary = columns.filter(column => column.mode === 'regular' && column.options.primary);
  assert.deepEqual(primary.map(column => column.propertyName).sort(), ['analysisId', 'kind']);
});
