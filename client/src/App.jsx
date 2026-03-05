import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Overview from './pages/Overview.jsx';
import WithdrawSend from './pages/WithdrawSend.jsx';
import Work from './pages/Work.jsx';
import Toast from './components/Toast.jsx';
import { api } from './api.js';

export default function App() {
  const [me, setMe] = useState(null);
  const [toast, setToast] = useState(null);

  const toastApi = useMemo(
    () => ({
      show: (msg, type = 'info') => {
        setToast({ msg, type, id: crypto.randomUUID() });
      },
      clear: () => setToast(null),
    }),
    [],
  );

  useEffect(() => {
    api
      .me()
      .then((d) => setMe(d.me))
      .catch((e) => toastApi.show(e.message, 'error'));
  }, []);

  // Light polling so work earnings “arrive” without refresh
  useEffect(() => {
    const t = setInterval(() => {
      api
        .me()
        .then((d) => setMe(d.me))
        .catch(() => {});
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="appShell">
      <div className="bgGlow" />
      <header className="topBar">
        <div className="brand">
          <div className="logoDot" />
          <div className="brandText">
            <div className="brandName">NeonBank</div>
            <div className="brandTag">dark • purple • modern</div>
          </div>
        </div>
        <div className="mePill">
          <div className="meName">{me?.name ?? '...'}</div>
          <div className="meSub">Local demo user</div>
        </div>
      </header>

      <main className="layout">
        <Nav />
        <section className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route
              path="/overview"
              element={<Overview setMe={setMe} toast={toastApi} />}
            />
            <Route
              path="/move"
              element={<WithdrawSend setMe={setMe} toast={toastApi} />}
            />
            <Route
              path="/work"
              element={<Work setMe={setMe} toast={toastApi} />}
            />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </section>
      </main>

      <Toast toast={toast} onClose={toastApi.clear} />
      <footer className="footer">SQLite-backed • Express API • React UI</footer>
    </div>
  );
}
