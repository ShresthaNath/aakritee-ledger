'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Users, Database, Settings, HelpCircle, LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutGrid },
    { name: 'Student Management', href: '/students', icon: Users },
    { name: 'Admission Tracker', href: '/tracker', icon: Database },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Logo Using Exact Provided AakriteeLogo.png */}
      <div className="sidebar-logo">
        {/* eslint-disable-next-html-element-suppress */}
        <img src="/AakriteeLogo.png" alt="Aakritee Logo" className="logo-img" />
        <span className="ledger-title font-heading">Ledger</span>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Matching Figma Node 204:136 */}
      <div className="sidebar-footer">
        <a href="#help" className="footer-link">
          <HelpCircle size={18} />
          <span>Help Center</span>
        </a>
        <button className="footer-link logout-btn">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          z-index: 40;
          transition: background-color 0.25s ease, border-color 0.25s ease;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 8px 24px 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .logo-img {
          height: 32px;
          width: auto;
          object-fit: contain;
        }

        .ledger-title {
          font-weight: 700;
          font-size: 20px;
          color: #FCD602;
          letter-spacing: -0.3px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 24px;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          color: #A0A5B5;
          text-decoration: none !important;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }

        .nav-link:hover {
          color: #FFFFFF;
          background-color: rgba(255, 255, 255, 0.05);
          text-decoration: none !important;
        }

        .nav-link.active {
          color: #FCD602;
          background-color: rgba(252, 214, 2, 0.1);
          border-left-color: #FCD602;
          text-decoration: none !important;
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: #A0A5B5;
          text-decoration: none !important;
          font-size: 13px;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          color: #FFFFFF;
          background-color: rgba(255, 255, 255, 0.05);
        }

        .logout-btn {
          color: #FF4D4D;
        }
        .logout-btn:hover {
          color: #FF6B6B;
          background-color: rgba(255, 77, 77, 0.1);
        }

        @media (max-width: 1024px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};
