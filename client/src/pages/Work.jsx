import React, { useMemo, useState } from 'react';
import Card from '../components/Card.jsx';
import GlowButton from '../components/GlowButton.jsx';
import { api, fmtEUR } from '../api.js';

export default function Work({ setMe, toast }) {
  const [busy, setBusy] = useState(false);

  // Tune these however you want:
  const rate = 2.5; // €/s
  const duration = 6; // seconds
  const total = useMemo(() => rate * duration, [rate, duration]);

  async function doWork() {
    try {
      setBusy(true);
      const d = await api.work(rate, duration);
      toast?.show(`Working… +€${total.toFixed(2)} lands in ${duration}s`, 'ok');

      // No fake crediting on client; server credits when available.
      // We just refresh the visible balance after the job should land.
      setTimeout(
        async () => {
          try {
            const me = await api.me();
            setMe?.(me.me);
            toast?.show(`Work completed: +€${total.toFixed(2)}`, 'ok');
          } catch {}
        },
        duration * 1000 + 250,
      );
    } catch (e) {
      toast?.show(e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="workWrap">
      <Card
        title="Work"
        subtitle="Click to start a timed job. Earnings are credited after the timer (server + DB)."
      >
        <div className="workCenter">
          <GlowButton
            variant="work"
            onClick={doWork}
            disabled={busy}
            className="workBtn"
          >
            <div className="workBtnContent">
              <div className="workBtnTitle">
                {busy ? 'Working…' : 'Start Work'}
              </div>
              <div className="workBtnMeta">
                <span className="greenSmall">{rate.toFixed(2)}€/s</span>
                <span className="dotSep">•</span>
                <span className="mutedSmall">{duration}s</span>
                <span className="dotSep">•</span>
                <span className="mutedSmall">
                  {fmtEUR(Math.round(total * 100))} total
                </span>
              </div>
            </div>
          </GlowButton>

          <div className="workHint">
            Server stores a <b>pending job</b> and credits it when the unlock
            time is reached.
          </div>
        </div>
      </Card>
    </div>
  );
}
