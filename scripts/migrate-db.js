import 'dotenv/config';
import 'reflect-metadata';

const command = process.argv[2] ?? 'up';
const { dataSource, initializeDatabase, closeDatabase } = await import('../dist/db/index.js');

try {
  await initializeDatabase();

  if (command === 'up') {
    const executed = await dataSource.runMigrations();
    console.log('Migraciones ejecutadas:', executed.map(migration => migration.name));
  } else if (command === 'status') {
    const pending = await dataSource.showMigrations();
    console.log(pending ? 'Hay migraciones pendientes.' : 'Todas las migraciones están aplicadas.');
  } else if (command === 'down') {
    await dataSource.undoLastMigration();
  } else {
    throw new Error('Comando inválido: usá up, down o status.');
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await closeDatabase();
}
