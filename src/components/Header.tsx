'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Plus, Sun, Moon, Menu, X, LayoutGrid, Users, Database, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

import { useRouter } from 'next/navigation';

interface HeaderProps {
  onOpenNewAdmission: () => void;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewAdmission, onSearchChange }) => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aakritee_auth');
    }
    router.push('/login');
  };

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
        {/* Left Side: Mobile Hamburger & Search Input */}
        <div className="header-left">
          <button
            className="mobile-hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
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

          <div className="user-profile-box">
            <div className="avatar font-heading">SA</div>
            <div className="user-info">
              <span className="user-name font-heading">SuperAdmin</span>
              <span className="user-role">INSTITUTIONAL LEAD</span>
            </div>
            <button className="logout-icon-btn" onClick={handleLogout} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
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
              <div className="drawer-admission-box">
                <button
                  className="btn-primary drawer-admission-btn"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenNewAdmission();
                  }}
                >
                  <Plus size={18} />
                  <span>New Admission</span>
                </button>
              </div>

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
          color: #FED602;
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

        .user-profile-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 10px 4px 4px;
          border: 1px solid var(--border-color);
          border-radius: 30px;
          background-color: var(--bg-surface);
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--bg-deep);
          border: 2px solid var(--accent-yellow);
          color: var(--accent-yellow);
          font-weight: 800;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
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
          white-space: nowrap;
        }

        .user-role {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .logout-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-left: 4px;
        }

        .logout-icon-btn:hover {
          color: var(--status-red);
          border-color: var(--status-red);
          background-color: rgba(239, 68, 68, 0.1);
        }

        /* Mobile Drawer */
        .mobile-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(7, 10, 22, 0.85);
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
          padding: 24px 0;
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px 20px 24px;
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
          color: #FED602;
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
          gap: 4px;
          margin-top: 16px;
          flex: 1;
        }

        .drawer-admission-box {
          padding: 0 16px 12px 16px;
        }

        .drawer-admission-btn {
          width: 100%;
          justify-content: center;
          height: 42px;
          border-radius: 20px;
        }

        .drawer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          width: 100%;
          color: #8A94C2;
          text-decoration: none !important;
          font-weight: 500;
          font-size: 14px;
          border-left: 4px solid transparent;
        }

        .drawer-link.active {
          color: #FED602 !important;
          background-color: rgba(254, 214, 2, 0.15) !important;
          border-left-color: #FED602 !important;
          font-weight: 600 !important;
        }

        .drawer-footer {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px 12px 0 12px;
          border-top: 1px solid var(--border-color);
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: #8A94C2;
          text-decoration: none !important;
          font-size: 13px;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
        }

        .logout-btn {
          color: #FF4D4D;
        }

        @media (min-width: 1025px) {
          .header-bar {
            display: none !important;
          }
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
