import React from 'react';
import { NavLink } from 'react-router-dom';

function Icon({ name }) {
  // tiny inline icons (simple, crisp)
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none' };
  if (name === 'overview') {
    return (
      <svg {...common}>
        <path
          d="M4 12h7V4H4v8Zm9 8h7V4h-7v16ZM4 20h7v-6H4v6Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }
  if (name === 'move') {
    return (
      <svg {...common}>
        <path
          d="M7 7h10M7 7l3-3M7 7l3 3M17 17H7m10 0-3-3m3 3-3 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M12 2v4m0 12v4M4 12h4m12 0h4M7.1 7.1l2.8 2.8m4.2 4.2 2.8 2.8M16.9 7.1l-2.8 2.8M9.9 14.1 7.1 16.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 7.5c2.5 0 4.5 2 4.5 4.5S14.5 16.5 12 16.5 7.5 14.5 7.5 12 9.5 7.5 12 7.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function Nav() {
  return (
    <nav className="sideNav">
      <NavLink
        className={({ isActive }) => `navItem ${isActive ? 'active' : ''}`}
        to="/overview"
      >
        <Icon name="overview" />
        <div className="navText">
          <div className="navTitle">Overview</div>
          <div className="navSub">Balance + activity</div>
        </div>
      </NavLink>

      <NavLink
        className={({ isActive }) => `navItem ${isActive ? 'active' : ''}`}
        to="/move"
      >
        <Icon name="move" />
        <div className="navText">
          <div className="navTitle">Withdraw / Send</div>
          <div className="navSub">Move money</div>
        </div>
      </NavLink>

      <NavLink
        className={({ isActive }) => `navItem ${isActive ? 'active' : ''}`}
        to="/work"
      >
        <Icon name="work" />
        <div className="navText">
          <div className="navTitle">Work</div>
          <div className="navSub">Earn € over time</div>
        </div>
      </NavLink>
    </nav>
  );
}
