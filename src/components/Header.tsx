'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Plus, Sun, Moon, Menu, X, LayoutGrid, Users, Database, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  onOpenNewAdmission: () => void;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewAdmission, onSearchChange }) => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutGrid },
    { name: 'Student Management', href: '/students', icon: Users },
    { name: 'Admission Tracker', href: '/tracker', icon: Database },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <header className="header-bar">
        {/* Left Side: Mobile Hamburger + Logo on Mobile, Search on Desktop */}
        <div className="header-left">
          <button
            className="mobile-hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={22} />
          </button>

          <div className="mobile-brand">
            {/* eslint-disable-next-html-element-suppress */}
            <img src="/AakriteeLogo.png" alt="Aakritee Logo" className="mobile-logo-img" />
            <span className="mobile-title font-heading">Ledger</span>
          </div>

          <div className="search-container desktop-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by student name or roll no..."
              value={query}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="header-actions">
          <button className="theme-toggle-quick" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="btn-primary desktop-admission-btn" onClick={onOpenNewAdmission}>
            <Plus size={18} />
            <span>New Admission</span>
          </button>

          <div className="user-profile">
            <div className="avatar font-heading">SA</div>
            <div className="user-info">
              <span className="user-name font-heading">SuperAdmin</span>
              <span className="user-role">INSTITUTIONAL LEAD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Drawer matching Figma Node 204:1938 */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="brand-box">
                {/* eslint-disable-next-html-element-suppress */}
                <img src="/AakriteeLogo.png" alt="Aakritee Logo" className="logo-img" />
                <span className="ledger-title font-heading">Ledger</span>
              </div>
              <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <nav className="drawer-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`drawer-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="drawer-footer">
              <a href="#help" className="footer-link">
                <HelpCircle size={18} />
                <span>Help Center</span>
              </a>
              <button className="footer-link logout-btn">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .header-bar {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-deep);
          position: sticky;
          top: 0;
          z-index: 30;
          transition: background-color 0.25s ease;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mobile-hamburger {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 6px;
        }

        .mobile-brand {
          display: none;
          align-items: center;
          gap: 8px;
        }

        .mobile-logo-img {
          height: 26px;
          width: auto;
        }

        .mobile-title {
          font-weight: 700;
          font-size: 16px;
          color: #FCD602;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 360px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
          z-index: 5;
        }

        .search-input {
          width: 100%;
          height: 42px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding-left: 44px;
          padding-right: 16px;
          border-radius: 24px;
          font-family: var(--font-body);
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          border-color: var(--accent-yellow);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .theme-toggle-quick {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .theme-toggle-quick:hover {
          border-color: var(--accent-yellow);
          color: var(--accent-yellow);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--bg-surface);
          border: 2px solid var(--accent-yellow);
          color: var(--accent-yellow);
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 700;
          font-size: 13px;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .user-role {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        /* Mobile Drawer */
        .mobile-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(7, 10, 22, 0.8);
          backdrop-filter: blur(6px);
          z-index: 100;
        }

        .mobile-drawer-content {
          width: 280px;
          height: 100vh;
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .brand-box {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-img {
          height: 28px;
          width: auto;
        }

        .ledger-title {
          font-weight: 700;
          font-size: 18px;
          color: #FCD602;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 24px;
          flex: 1;
        }

        .drawer-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          color: #A0A5B5;
          text-decoration: none !important;
          font-weight: 600;
          font-size: 14px;
        }

        .drawer-link.active {
          color: #FCD602;
          background-color: rgba(252, 214, 2, 0.1);
          border-left: 3px solid #FCD602;
        }

        .drawer-footer {
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
        }

        .logout-btn {
          color: #FF4D4D;
        }

        @media (max-width: 1024px) {
          .header-bar {
            padding: 0 16px;
          }
          .mobile-hamburger {
            display: flex;
          }
          .mobile-brand {
            display: flex;
          }
          .desktop-search {
            display: none;
          }
          .desktop-admission-btn {
            display: none;
          }
          .user-info {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
