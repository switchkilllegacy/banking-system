import express from 'express';
import cors from 'cors';
import {
  getUser,
  withdraw,
  sendMoney,
  listFriends,
  startWork,
  listRecentTransfers,
  getPendingWork,
} from './logic.js';

const app = express();
app.use(cors());
app.use(express.json());

const ME = 1;

function eurosToCents(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

app.get('/api/me', async (req, res) => {
  try {
    const me = await getUser(ME);
    res.json({ me });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/overview', async (req, res) => {
  try {
    const me = await getUser(ME);
    const transfers = await listRecentTransfers(ME);
    const pendingWork = await getPendingWork(ME);
    res.json({ me, transfers, pendingWork });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/friends', async (req, res) => {
  try {
    res.json({ friends: await listFriends(ME) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/withdraw', async (req, res) => {
  try {
    const cents = eurosToCents(req.body?.amount);
    if (cents === null) throw new Error('Invalid amount.');
    const me = await withdraw(ME, cents);
    res.json({ me });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/send', async (req, res) => {
  try {
    const toUserId = Number(req.body?.toUserId);
    const cents = eurosToCents(req.body?.amount);
    const note = String(req.body?.note ?? '');

    if (!Number.isInteger(toUserId)) throw new Error('Invalid recipient.');
    if (cents === null) throw new Error('Invalid amount.');

    const result = await sendMoney(ME, toUserId, cents, note);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/work', async (req, res) => {
  try {
    const rateEur = req.body?.rateEurPerSec ?? 2.5;
    const durationSec = req.body?.durationSec ?? 6;

    const rateCentsPerSec = eurosToCents(rateEur);
    if (rateCentsPerSec === null) throw new Error('Invalid rate.');
    if (!Number.isInteger(durationSec) || durationSec <= 0)
      throw new Error('Invalid duration.');

    const job = await startWork(ME, rateCentsPerSec, durationSec);
    res.json({ job });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 5179;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
