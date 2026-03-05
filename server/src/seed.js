import { initSchema, run } from './db.js';

await initSchema();

await run(`DELETE FROM transfers;`);
await run(`DELETE FROM work_jobs;`);
await run(`DELETE FROM users;`);

await run(`INSERT INTO users (id, name, balance_cents) VALUES (?, ?, ?)`, [
  1,
  'You',
  125000,
]);
await run(`INSERT INTO users (id, name, balance_cents) VALUES (?, ?, ?)`, [
  2,
  'Alex',
  50000,
]);

console.log('Seeded DB with: You (id=1), Alex (id=2)');
