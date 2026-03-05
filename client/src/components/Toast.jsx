import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onClose?.(), 3200);
    return () => clearTimeout(t);
  }, [toast?.id]);

  if (!toast) return null;

  return (
    <div className={`toast ${toast.type}`}>
      <div className="toastDot" />
      <div className="toastMsg">{toast.msg}</div>
      <button className="toastX" onClick={onClose} aria-label="Close toast">
        ×
      </button>
    </div>
  );
}
