const BASE = 'http://localhost:5179';

async function req(path, opts) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Request failed');
  return data;
}

export const api = {
  me: () => req('/api/me'),
  overview: () => req('/api/overview'),
  friends: () => req('/api/friends'),
  withdraw: (amount) =>
    req('/api/withdraw', { method: 'POST', body: JSON.stringify({ amount }) }),
  send: (toUserId, amount, note) =>
    req('/api/send', {
      method: 'POST',
      body: JSON.stringify({ toUserId, amount, note }),
    }),
  work: (rateEurPerSec, durationSec) =>
    req('/api/work', {
      method: 'POST',
      body: JSON.stringify({ rateEurPerSec, durationSec }),
    }),
};

export function fmtEUR(cents) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'EUR',
  }).format((cents ?? 0) / 100);
}
