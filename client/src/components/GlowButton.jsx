import React from 'react';

export default function GlowButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
  className = '',
}) {
  return (
    <button
      className={`glowBtn ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <span className="glowBtnInner">{children}</span>
      <span className="glowBtnSheen" />
    </button>
  );
}
