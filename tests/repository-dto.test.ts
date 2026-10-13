import test from 'node:test';
import assert from 'node:assert/strict';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateRepositoryDto } from '../src/modules/repositories/dto/create-repository.dto.js';

test('El DTO valida un repositorio de GitHub válido', () => {
  const dto = plainToInstance(CreateRepositoryDto, {
    owner: ' julianf97 ',
    name: ' code-analysis-agent ',
  });

  assert.deepEqual(validateSync(dto), []);
  assert.equal(dto.owner, 'julianf97');
  assert.equal(dto.name, 'code-analysis-agent');
});

test('El DTO rechaza nombres de repositorios inválidos', () => {
  const dto = plainToInstance(CreateRepositoryDto, {
    owner: 'julianf97',
    name: 'repositorio con espacios',
  });

  assert.ok(validateSync(dto).length > 0);
});
