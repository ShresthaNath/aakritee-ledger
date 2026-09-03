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
      {/* Brand Header */}
      <div className="sidebar-logo">
        {/* eslint-disable-next-html-element-suppress */}
        <img src="/AakriteeLogo.png" alt="Aakritee Logo" className="logo-img" />
        <span className="ledger-title font-heading">Ledger</span>
      </div>

      {/* Nav Items Matching Figma Nodes 204:600, 204:604, 204:608, 204:612 */}
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
              <Icon size={20} className="nav-icon" />
              <span className="nav-text">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Matching Figma Spec */}
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
          padding: 24px 0;
          z-index: 40;
          transition: background-color 0.25s ease, border-color 0.25s ease;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 24px 20px 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .logo-img {
          height: 32px;
          width: auto;
          object-fit: contain;
        }

        .ledger-title {
          font-weight: 800;
          font-size: 20px;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 20px;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 24px;
          width: 100%;
          color: var(--text-secondary);
          text-decoration: none !important;
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 14px;
          border-left: 4px solid transparent;
          background-color: transparent;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface-hover);
          text-decoration: none !important;
        }

        /* Highlight ONLY the active route page */
        .nav-link.active {
          color: var(--text-primary) !important;
          background-color: var(--accent-yellow-subtle) !important;
          border-left: 4px solid var(--accent-yellow) !important;
          font-weight: 600 !important;
          text-decoration: none !important;
        }

        .nav-text {
          white-space: nowrap;
        }

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px 16px 0 16px;
          border-top: 1px solid var(--border-color);
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 14px;
          color: var(--text-secondary);
          text-decoration: none !important;
          font-size: 13px;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          width: 100%;
        }

        .footer-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface-hover);
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
