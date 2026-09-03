'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Users, Database, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aakritee_auth');
    }
    router.push('/login');
  };

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

      {/* Sidebar Footer with Theme Toggle & User Profile Card */}
      <div className="sidebar-footer">
        {/* Theme Toggle Button */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span className="theme-text">{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
        </button>

        {/* User Profile Badge & Logout */}
        <div className="sidebar-user-card">
          <div className="user-info-group">
            <div className="avatar font-heading">SA</div>
            <div className="user-details">
              <span className="user-name font-heading">SuperAdmin</span>
              <span className="user-role">INSTITUTIONAL LEAD</span>
            </div>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
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
          padding: 24px 0 16px 0;
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
          gap: 12px;
          padding: 16px 16px 0 16px;
          border-top: 1px solid var(--border-color);
        }

        .theme-toggle-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          width: 100%;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-toggle-btn:hover {
          border-color: var(--accent-yellow);
          color: var(--accent-yellow);
        }

        .sidebar-user-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .user-info-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: var(--bg-deep);
          border: 2px solid var(--accent-yellow);
          color: var(--accent-yellow);
          font-weight: 800;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 700;
          font-size: 12px;
          color: var(--text-primary);
          line-height: 1.2;
          white-space: nowrap;
        }

        .user-role {
          font-size: 9px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .sidebar-logout-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .sidebar-logout-btn:hover {
          color: #EF4444;
          border-color: #EF4444;
          background-color: rgba(239, 68, 68, 0.1);
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
