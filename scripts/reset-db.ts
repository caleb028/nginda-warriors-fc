import { createInitialDatabaseState, writeDatabase } from '../packages/shared/src/server';

const initial = createInitialDatabaseState();
writeDatabase(initial);
console.log('Database reset to clean production initial state.');

