import sqlite3 from 'sqlite3';
sqlite3.verbose();

export const db = new sqlite3.Database('bank.db');

// Promise helpers
export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export async function initSchema() {
  await run(`PRAGMA journal_mode = WAL;`);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      balance_cents INTEGER NOT NULL DEFAULT 0
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS transfers (
      id INTEGER PRIMARY KEY,
      from_user_id INTEGER NOT NULL,
      to_user_id INTEGER NOT NULL,
      amount_cents INTEGER NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS work_jobs (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      rate_cents_per_sec INTEGER NOT NULL,
      duration_sec INTEGER NOT NULL,
      total_cents INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      available_at INTEGER NOT NULL,
      credited_at INTEGER
    )
  `);
}
