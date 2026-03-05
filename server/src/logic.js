import { all, get, run, initSchema } from './db.js';

await initSchema();

export async function settleDueWorkJobs(userId) {
  const now = Date.now();

  const due = await all(
    `
    SELECT id, total_cents
    FROM work_jobs
    WHERE user_id = ?
      AND credited_at IS NULL
      AND available_at <= ?
    `,
    [userId, now],
  );

  if (due.length === 0) return { creditedCents: 0, creditedJobs: 0 };

  const sum = due.reduce((acc, r) => acc + r.total_cents, 0);

  await run('BEGIN TRANSACTION');
  try {
    await run(
      `UPDATE users SET balance_cents = balance_cents + ? WHERE id = ?`,
      [sum, userId],
    );
    for (const job of due) {
      await run(`UPDATE work_jobs SET credited_at = ? WHERE id = ?`, [
        now,
        job.id,
      ]);
    }
    await run('COMMIT');
  } catch (e) {
    await run('ROLLBACK');
    throw e;
  }

  return { creditedCents: sum, creditedJobs: due.length };
}

export async function getUser(userId) {
  await settleDueWorkJobs(userId);
  return await get(`SELECT id, name, balance_cents FROM users WHERE id = ?`, [
    userId,
  ]);
}

export async function getPendingWork(userId) {
  const now = Date.now();
  const rows = await all(
    `
    SELECT id, rate_cents_per_sec, duration_sec, total_cents, created_at, available_at
    FROM work_jobs
    WHERE user_id = ?
      AND credited_at IS NULL
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [userId],
  );

  return rows.map((j) => ({
    ...j,
    ms_remaining: Math.max(0, j.available_at - now),
  }));
}

export async function listRecentTransfers(userId) {
  return await all(
    `
    SELECT
      t.id, t.amount_cents, t.note, t.created_at,
      uf.name AS from_name,
      ut.name AS to_name,
      t.from_user_id, t.to_user_id
    FROM transfers t
    JOIN users uf ON uf.id = t.from_user_id
    JOIN users ut ON ut.id = t.to_user_id
    WHERE t.from_user_id = ? OR t.to_user_id = ?
    ORDER BY t.created_at DESC
    LIMIT 8
    `,
    [userId, userId],
  );
}

export async function withdraw(userId, amountCents) {
  if (!Number.isInteger(amountCents) || amountCents <= 0)
    throw new Error('Invalid withdraw amount.');

  await run('BEGIN TRANSACTION');
  try {
    const u = await get(`SELECT balance_cents FROM users WHERE id = ?`, [
      userId,
    ]);
    if (!u) throw new Error('User not found.');
    if (u.balance_cents < amountCents) throw new Error('Insufficient funds.');

    await run(
      `UPDATE users SET balance_cents = balance_cents - ? WHERE id = ?`,
      [amountCents, userId],
    );
    await run('COMMIT');
  } catch (e) {
    await run('ROLLBACK');
    throw e;
  }

  return await getUser(userId);
}

export async function sendMoney(fromUserId, toUserId, amountCents, note = '') {
  if (!Number.isInteger(amountCents) || amountCents <= 0)
    throw new Error('Invalid send amount.');
  if (fromUserId === toUserId)
    throw new Error("You can't send money to yourself.");

  await run('BEGIN TRANSACTION');
  try {
    const from = await get(`SELECT balance_cents FROM users WHERE id = ?`, [
      fromUserId,
    ]);
    const to = await get(`SELECT id FROM users WHERE id = ?`, [toUserId]);

    if (!from) throw new Error('Sender not found.');
    if (!to) throw new Error('Recipient not found.');
    if (from.balance_cents < amountCents)
      throw new Error('Insufficient funds.');

    await run(
      `UPDATE users SET balance_cents = balance_cents - ? WHERE id = ?`,
      [amountCents, fromUserId],
    );
    await run(
      `UPDATE users SET balance_cents = balance_cents + ? WHERE id = ?`,
      [amountCents, toUserId],
    );

    await run(
      `
      INSERT INTO transfers (from_user_id, to_user_id, amount_cents, note, created_at)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        fromUserId,
        toUserId,
        amountCents,
        (note ?? '').slice(0, 80),
        Date.now(),
      ],
    );

    await run('COMMIT');
  } catch (e) {
    await run('ROLLBACK');
    throw e;
  }

  return {
    from: await getUser(fromUserId),
    to: await get(`SELECT id, name, balance_cents FROM users WHERE id = ?`, [
      toUserId,
    ]),
  };
}

export async function listFriends(userId) {
  return await all(`SELECT id, name FROM users WHERE id != ? ORDER BY name`, [
    userId,
  ]);
}

export async function startWork(userId, rateCentsPerSec, durationSec) {
  if (!Number.isInteger(rateCentsPerSec) || rateCentsPerSec <= 0)
    throw new Error('Bad rate.');
  if (!Number.isInteger(durationSec) || durationSec <= 0)
    throw new Error('Bad duration.');

  const createdAt = Date.now();
  const availableAt = createdAt + durationSec * 1000;
  const totalCents = rateCentsPerSec * durationSec;

  const ins = await run(
    `
    INSERT INTO work_jobs (user_id, rate_cents_per_sec, duration_sec, total_cents, created_at, available_at, credited_at)
    VALUES (?, ?, ?, ?, ?, ?, NULL)
    `,
    [userId, rateCentsPerSec, durationSec, totalCents, createdAt, availableAt],
  );

  return await get(
    `
    SELECT id, user_id, rate_cents_per_sec, duration_sec, total_cents, created_at, available_at, credited_at
    FROM work_jobs
    WHERE id = ?
    `,
    [ins.lastID],
  );
}
