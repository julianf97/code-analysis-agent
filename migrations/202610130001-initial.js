import { readFile } from 'node:fs/promises';

// Conservamos el DDL inicial porque ya se publicó en una etapa anterior.
// Todo el acceso CRUD posterior se realiza mediante modelos Sequelize.
export async function up({ context: queryInterface }) {
  const { sequelize } = queryInterface;
  const schema = process.env.DB_USE_TEST_SCHEMA === 'true'
    ? process.env.DB_TEST_SCHEMA
    : process.env.DB_SCHEMA || 'public';
  if (schema !== 'public') {
    throw new Error('La migración inicial histórica solo admite DB_SCHEMA=public. No se modificó ningún dato.');
  }
  const sql = await readFile(new URL('./001_initial.sql', import.meta.url), 'utf8');
  await sequelize.transaction(async transaction => {
    await sequelize.query(sql, { transaction });
  });
}

export async function down() {
  // No eliminamos tablas ni datos automáticamente.
  throw new Error('La migración inicial no tiene rollback destructivo. Realizá una migración de reversión explícita.');
}
