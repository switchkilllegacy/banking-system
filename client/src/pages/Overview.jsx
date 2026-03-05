import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card.jsx';
import { api, fmtEUR } from '../api.js';

function TransferRow({ t, meId = 1 }) {
  const isOut = t.from_user_id === meId;
  return (
    <div className="row">
      <div className="rowMain">
        <div className="rowTitle">
          {isOut ? `Sent → ${t.to_name}` : `Received ← ${t.from_name}`}
        </div>
        <div className="rowSub">
          {new Date(t.created_at).toLocaleString()}{' '}
          {t.note ? `• ${t.note}` : ''}
        </div>
      </div>
      <div className={`amt ${isOut ? 'out' : 'in'}`}>
        {isOut ? '−' : '+'}
        {fmtEUR(t.amount_cents)}
      </div>
    </div>
  );
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function Overview({ setMe, toast }) {
  const [data, setData] = useState(null);

  async function load() {
    try {
      const d = await api.overview();
      setData(d);
      setMe?.(d.me);
    } catch (e) {
      toast?.show(e.message, 'error');
    }
  }

  useEffect(() => {
    load();
  }, []);

  // light polling so pending progress updates smoothly
  useEffect(() => {
    const t = setInterval(() => {
      load();
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const pending = data?.pendingWork ?? [];

  const pendingWithProgress = useMemo(() => {
    return pending.map((p) => {
      const totalMs = (p.duration_sec ?? 0) * 1000;
      const remaining = p.ms_remaining ?? 0;

      // if server didn't send duration for some reason, default to "unknown"
      const progress =
        totalMs > 0 ? clamp(100 - (remaining / totalMs) * 100, 0, 100) : 0;

      return { ...p, progress };
    });
  }, [pending]);

  return (
    <div className="grid">
      <Card
        title="Balance"
        subtitle="Your current account value (database-backed)"
        right={<span className="chip">Live</span>}
      >
        <div className="bigBalance">{fmtEUR(data?.me?.balance_cents ?? 0)}</div>

        {pendingWithProgress.length > 0 ? (
          <div className="pending">
            <div className="pendingTitle">Pending earnings</div>

            {pendingWithProgress.map((p) => (
              <div key={p.id} className="pendingRow">
                <div className="pendingLeft">
                  <div className="pendingName">Work job #{p.id}</div>

                  <div className="pendingSub">{fmtEUR(p.total_cents)}</div>

                  <div
                    className="pendingProgress"
                    aria-label="Pending progress"
                  >
                    <div
                      className="pendingProgressFill"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                <div className="pendingStatus">Pending</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="hint">
            Tip: hit <b>Work</b> to generate timed earnings.
          </div>
        )}
      </Card>

      <Card
        title="Recent activity"
        subtitle="Transfers in / out (latest first)"
      >
        <div className="list">
          {(data?.transfers?.length ?? 0) === 0 ? (
            <div className="empty">No transfers yet.</div>
          ) : (
            data.transfers.map((t) => <TransferRow key={t.id} t={t} />)
          )}
        </div>

        <div className="actionsRow">
          <button className="textLink" onClick={load}>
            Refresh
          </button>
        </div>
      </Card>
    </div>
  );
}
