'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Users, Database, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutGrid },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Tracker', href: '/tracker', icon: Database },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-tab ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} className="tab-icon" />
            <span className="tab-name">{item.name}</span>
            {isActive && <div className="active-dot" />}
          </Link>
        );
      })}

      <style jsx>{`
        .mobile-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100vw;
          height: 64px;
          background-color: var(--bg-sidebar);
          border-top: 1px solid var(--border-color);
          justify-content: space-around;
          align-items: center;
          z-index: 50;
          padding-bottom: env(safe-area-inset-bottom);
        }

        .mobile-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 11px;
          font-weight: 600;
          position: relative;
          width: 25%;
          height: 100%;
          transition: color 0.2s ease;
        }

        .mobile-tab.active {
          color: var(--accent-yellow);
        }

        .active-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--accent-yellow);
          position: absolute;
          bottom: 6px;
        }

        @media (max-width: 1024px) {
          .mobile-nav {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
};
