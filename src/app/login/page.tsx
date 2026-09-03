'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('superadmin@aakritee.edu');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Store dummy auth session token
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('aakritee_auth', JSON.stringify({
          authenticated: true,
          email: email,
          role: 'SuperAdmin',
          loginTime: new Date().toISOString(),
        }));
      }
      setIsLoading(false);
      router.push('/');
    }, 600);
  };

  return (
    <div className="login-container">
      {/* Background Subtle Geometry Glow */}
      <div className="bg-glow glow-1" />
      <div className="bg-glow glow-2" />

      <div className="login-card-wrapper animate-fade-in">
        {/* Brand Header */}
        <div className="brand-header">
          <Image
            src="/AakriteeLogo.png"
            alt="Aakritee Logo"
            width={44}
            height={44}
            className="brand-logo"
            priority
          />
          <span className="brand-title font-heading">Ledger</span>
        </div>

        {/* Auth Box */}
        <div className="card login-card">
          <h1 className="login-title font-heading">Welcome Back</h1>
          <p className="login-subtitle">Art School Financial Ledger</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="input-label font-heading">EMAIL OR USERNAME</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@aakritee.edu"
                  className="login-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label font-heading">SECURITY PASSWORD</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password"
                  className="login-input"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to superadmin@aakritee.edu'); }} className="forgot-link font-heading">
                Forgot?
              </a>
            </div>

            <button type="submit" className="submit-btn font-heading" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Secure Sign In'}
            </button>
          </form>

          <div className="security-badge">
            <ShieldCheck size={14} className="shield-icon" />
            <span>Encrypted Admin Pipeline</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="login-footer">
          <p>© 2026 Aakritee Art School. All rights reserved.</p>
          <p className="platform-version">Ledger Platform v4.2.1-Dark</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          width: 100vw;
          background-color: #070A16;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        .bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          pointer-events: none;
        }

        .glow-1 {
          width: 500px;
          height: 500px;
          background: #FED602;
          top: -150px;
          left: -150px;
        }

        .glow-2 {
          width: 600px;
          height: 600px;
          background: #3B82F6;
          bottom: -200px;
          right: -200px;
        }

        .login-card-wrapper {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .brand-title {
          font-size: 26px;
          font-weight: 800;
          color: #FED602;
          letter-spacing: -0.5px;
        }

        .login-card {
          width: 100%;
          background-color: #0D1222;
          border: 1px solid rgba(254, 214, 2, 0.2);
          border-radius: 16px;
          padding: 36px 32px 28px 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        }

        .login-title {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 4px;
        }

        .login-subtitle {
          font-size: 13px;
          color: #94A3B8;
          margin-bottom: 28px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 11px;
          font-weight: 700;
          color: #94A3B8;
          letter-spacing: 0.8px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #64748B;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          height: 46px;
          background-color: #070A16;
          border: 1px solid #1E293B;
          border-radius: 8px;
          color: #F8FAFC;
          padding-left: 44px;
          padding-right: 44px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .login-input:focus {
          border-color: #FED602;
        }

        .toggle-password-btn {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: #64748B;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .toggle-password-btn:hover {
          color: #F8FAFC;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .remember-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94A3B8;
          cursor: pointer;
        }

        .remember-checkbox input {
          accent-color: #FED602;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .forgot-link {
          color: #FED602;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }

        .submit-btn {
          width: 100%;
          height: 48px;
          background-color: #FED602;
          color: #070A16;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          margin-top: 8px;
          transition: transform 0.1s ease, filter 0.2s ease;
        }

        .submit-btn:hover {
          filter: brightness(1.08);
        }

        .submit-btn:active {
          transform: scale(0.99);
        }

        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 24px;
          font-size: 12px;
          color: #64748B;
        }

        .shield-icon {
          color: #FED602;
        }

        .login-footer {
          margin-top: 32px;
          text-align: center;
          font-size: 12px;
          color: #475569;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .platform-version {
          font-size: 11px;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
