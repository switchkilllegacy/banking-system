import React, { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import GlowButton from '../components/GlowButton.jsx';
import { api } from '../api.js';

export default function WithdrawSend({ setMe, toast }) {
  const [friends, setFriends] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('20');
  const [sendAmount, setSendAmount] = useState('15');
  const [note, setNote] = useState('coffee');
  const [toUserId, setToUserId] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .friends()
      .then((d) => {
        setFriends(d.friends);
        setToUserId(d.friends?.[0]?.id ?? null);
      })
      .catch((e) => toast?.show(e.message, 'error'));
  }, []);

  async function doWithdraw() {
    try {
      setBusy(true);
      const d = await api.withdraw(withdrawAmount);
      setMe?.(d.me);
      toast?.show(`Withdrawn €${Number(withdrawAmount).toFixed(2)}`, 'ok');
    } catch (e) {
      toast?.show(e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function doSend() {
    try {
      if (!toUserId) throw new Error('No recipient.');
      setBusy(true);
      const d = await api.send(Number(toUserId), sendAmount, note);
      setMe?.(d.from);
      const friendName =
        friends.find((f) => f.id === Number(toUserId))?.name ?? 'Friend';
      toast?.show(
        `Sent €${Number(sendAmount).toFixed(2)} → ${friendName}`,
        'ok',
      );
    } catch (e) {
      toast?.show(e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid">
      <Card title="Withdraw" subtitle="Pull money out of your balance">
        <div className="form">
          <label className="label">Amount (€)</label>
          <input
            className="input"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="e.g. 20"
          />
          <GlowButton variant="danger" onClick={doWithdraw} disabled={busy}>
            <div className="btnCol">
              <div>Withdraw</div>
              <div className="btnSub">Immediate debit</div>
            </div>
          </GlowButton>
        </div>
      </Card>

      <Card
        title="Send to a friend"
        subtitle="Transfer money instantly (DB logged)"
      >
        <div className="form">
          <label className="label">Friend</label>
          <select
            className="input"
            value={toUserId ?? ''}
            onChange={(e) => setToUserId(e.target.value)}
          >
            {friends.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <label className="label">Amount (€)</label>
          <input
            className="input"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
            placeholder="e.g. 15"
          />

          <label className="label">Note (optional)</label>
          <input
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="what for?"
          />

          <GlowButton variant="primary" onClick={doSend} disabled={busy}>
            <div className="btnCol">
              <div>Send</div>
              <div className="btnSub">Instant transfer</div>
            </div>
          </GlowButton>
        </div>
      </Card>
    </div>
  );
}
