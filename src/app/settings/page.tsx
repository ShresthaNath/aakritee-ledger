'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { NewAdmissionModal } from '@/components/NewAdmissionModal';
import { DataService } from '@/lib/dataService';
import { ArtGroup, PaymentModeSetting } from '@/lib/types';
import { Plus, Download, Database, ChevronRight, Check } from 'lucide-react';

export default function SettingsPage() {
  const [groups, setGroups] = useState<ArtGroup[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentModeSetting[]>([]);
  const [isNewAdmissionOpen, setIsNewAdmissionOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);

  const loadData = () => {
    setGroups(DataService.getGroups());
    setPaymentModes(DataService.getPaymentModes());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePaymentMode = (id: string) => {
    DataService.togglePaymentMode(id);
    loadData();
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    DataService.addGroup(newGroupName.trim());
    setNewGroupName('');
    setShowAddGroupForm(false);
    loadData();
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-layout">
        <Header onOpenNewAdmission={() => setIsNewAdmissionOpen(true)} />

        <main className="content-area animate-fade-in">
          <div className="page-header">
            <h1 className="page-title">System Settings</h1>
            <p className="page-subtitle">Configure art ledger architecture, payment methods, and data backups</p>
          </div>

          <div className="settings-stack">
            {/* 1. ART CLASS GROUPS SECTION */}
            <div className="card settings-card">
              <div className="card-header">
                <div>
                  <h3 className="section-title font-heading">ART CLASS GROUPS</h3>
                  <p className="section-sub">Manage active student batches & enrollment groups</p>
                </div>
                <button
                  className="btn-primary-sm"
                  onClick={() => setShowAddGroupForm(!showAddGroupForm)}
                >
                  <Plus size={14} />
                  <span>ADD GROUP</span>
                </button>
              </div>

              {showAddGroupForm && (
                <form onSubmit={handleAddGroup} className="add-group-form">
                  <input
                    type="text"
                    placeholder="Enter Group Code (e.g., Cp-M, B+)"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="input-field"
                    autoFocus
                  />
                  <button type="submit" className="btn-primary">
                    Save Group
                  </button>
                </form>
              )}

              <div className="groups-list">
                {groups.map((group) => (
                  <div key={group.id} className="group-item-card">
                    <div className="group-info">
                      <span className="group-code font-heading">{group.name}</span>
                      <span className="group-headcount">{group.active_headcount} Enrolled Students</span>
                    </div>
                    <ChevronRight size={18} className="chevron" />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. ACTIVE PAYMENT MODES SECTION */}
            <div className="card settings-card">
              <div className="card-header">
                <div>
                  <h3 className="section-title font-heading">ACTIVE PAYMENT MODES</h3>
                  <p className="section-sub">Configure enabled collection channels for fee payment receipt</p>
                </div>
              </div>

              <div className="payment-modes-list">
                {paymentModes.map((mode) => (
                  <div key={mode.id} className="mode-toggle-card">
                    <div className="mode-details">
                      <span className="mode-name">{mode.name}</span>
                      <span className="mode-status">{mode.enabled ? 'Active Channel' : 'Disabled'}</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={mode.enabled}
                        onChange={() => handleTogglePaymentMode(mode.id)}
                      />
                      <span className="slider round" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. BACKUPS & EXPORTS SECTION matching Figma Node 204:2301 */}
            <div className="card settings-card">
              <div className="card-header">
                <div>
                  <h3 className="section-title font-heading">BACKUPS &amp; EXPORTS</h3>
                  <p className="section-sub">Export system database snapshots and CSV accounting sheets</p>
                </div>
              </div>

              <div className="backup-buttons-row">
                <button
                  className="btn-secondary backup-btn"
                  onClick={() => DataService.exportLedgerCSV()}
                >
                  <Download size={18} />
                  <span>Export Ledger</span>
                </button>

                <button
                  className="btn-secondary backup-btn"
                  onClick={() => DataService.backupSQLSchema()}
                >
                  <Database size={18} />
                  <span>Backup SQL</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <NewAdmissionModal
        isOpen={isNewAdmissionOpen}
        onClose={() => setIsNewAdmissionOpen(false)}
        onStudentAdded={loadData}
      />

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background-color: var(--bg-deep);
        }

        .main-layout {
          margin-left: 260px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .content-area {
          padding: 32px;
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding-bottom: 90px;
        }

        .page-header {
          margin-bottom: 28px;
        }

        .page-title {
          font-size: 28px;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .page-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .settings-stack {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-card {
          padding: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 15px;
          color: var(--text-primary);
          letter-spacing: 0.5px;
        }

        .section-sub {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .btn-primary-sm {
          background-color: var(--accent-yellow);
          color: #070A16;
          border: none;
          padding: 6px 14px;
          border-radius: 16px;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .add-group-form {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .groups-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .group-item-card {
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: border-color 0.2s ease;
        }

        .group-item-card:hover {
          border-color: var(--accent-yellow);
        }

        .group-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .group-code {
          font-size: 16px;
          font-weight: 800;
          color: var(--accent-yellow);
          min-width: 60px;
        }

        .group-headcount {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .chevron {
          color: var(--text-muted);
        }

        .payment-modes-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mode-toggle-card {
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mode-details {
          display: flex;
          flex-direction: column;
        }

        .mode-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .mode-status {
          font-size: 12px;
          color: var(--text-muted);
        }

        /* Toggle switch styling */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--border-color);
          transition: .3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--accent-yellow);
        }

        input:checked + .slider:before {
          transform: translateX(20px);
          background-color: #070A16;
        }

        .backup-buttons-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .backup-btn {
          height: 48px;
          justify-content: center;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .main-layout {
            margin-left: 0;
            padding-bottom: 90px;
          }
          .content-area {
            padding: 16px 16px 90px 16px;
          }
          .backup-buttons-row {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
