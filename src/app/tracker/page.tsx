'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { NewAdmissionModal } from '@/components/NewAdmissionModal';
import { DataService } from '@/lib/dataService';
import { Student, FeeRecord, PaymentStatus, ArtGroup } from '@/lib/types';
import { Download, Database, Check, Clock, Minus, Sparkles, X, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

const ACADEMIC_MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'EXAM FEE'
];

export default function AdmissionTrackerPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<ArtGroup[]>([]);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isNewAdmissionOpen, setIsNewAdmissionOpen] = useState(false);

  // Modal State for Fee Payment Entry
  const [selectedCell, setSelectedCell] = useState<{
    student: Student;
    month: string;
    record?: FeeRecord;
  } | null>(null);

  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CASH' | 'BANK'>('UPI');

  const loadData = () => {
    const studentList = DataService.getStudents();
    const groupList = DataService.getGroups();
    const records = DataService.getFeeRecords();

    setStudents(studentList);
    setGroups(groupList);
    setFeeRecords(records);

    if (groupList.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groupList[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const groupStudents = students.filter((s) => s.group_id === selectedGroupId || s.group_name === currentGroup?.name);

  // Helper to get fee record status for a student in a specific month
  const getFeeRecord = (studentId: string, month: string): FeeRecord | undefined => {
    return feeRecords.find(
      (r) => r.student_id === studentId && (r.fee_period === month || r.month === month) && r.year === selectedYear
    );
  };

  const handleCellClick = (student: Student, month: string) => {
    const record = getFeeRecord(student.id, month);
    setSelectedCell({ student, month, record });
    setPaymentAmount(record?.amount || 500);
    setPaymentMode(record?.payment_mode || 'UPI');
  };

  const handleConfirmPayment = (status: 'PAID' | 'PENDING') => {
    if (!selectedCell) return;

    DataService.recordPayment({
      student_id: selectedCell.student.id,
      fee_period: selectedCell.month,
      year: selectedYear,
      amount: Number(paymentAmount),
      status,
      payment_mode: paymentMode,
    });

    if (status === 'PAID') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setSelectedCell(null);
    loadData();
  };

  // Calculate totals
  const totalCollected = feeRecords
    .filter((r) => r.status === 'PAID')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingDues = feeRecords
    .filter((r) => r.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-layout">
        <Header onOpenNewAdmission={() => setIsNewAdmissionOpen(true)} />

        <main className="content-area animate-fade-in">
          {/* Header Row */}
          <div className="page-header-row">
            <div>
              <h1 className="page-title">Admission Fee Tracker</h1>
              <p className="page-subtitle">12-Month tuition ledger & payment status tracking</p>
            </div>

            <div className="action-buttons-group">
              <button 
                className="btn-secondary"
                onClick={() => DataService.exportLedgerCSV()}
              >
                <Download size={16} />
                <span className="desktop-only">Export Ledger CSV</span>
              </button>
              <button 
                className="btn-secondary"
                onClick={() => DataService.backupSQLSchema()}
              >
                <Database size={16} />
                <span className="desktop-only">Backup SQL Schema</span>
              </button>
            </div>
          </div>

          {/* Group Filter Pills & Year Selector */}
          <div className="filters-control-bar">
            <div className="group-pills-row font-heading">
              {groups.map((g) => (
                <button
                  key={g.id}
                  className={`group-pill-btn ${selectedGroupId === g.id ? 'active' : ''}`}
                  onClick={() => setSelectedGroupId(g.id)}
                >
                  <span>{g.name}</span>
                  <span className="count-badge">{g.active_headcount}</span>
                </button>
              ))}
            </div>

            <div className="year-selector-wrapper">
              <label className="year-label font-heading">LEDGER YEAR:</label>
              <select
                className="year-select-dropdown font-heading"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
            </div>
          </div>

          {/* Main Interactive Fee Matrix Table */}
          <div className="card matrix-card">
            <div className="matrix-header">
              <h3 className="matrix-title font-heading">
                FEE LEDGER MATRIX — {currentGroup?.name || 'Cp-J'} GROUP ({selectedYear} ACADEMIC SESSION)
              </h3>
              <div className="legend">
                <span className="legend-item"><span className="dot dot-paid" /> Paid</span>
                <span className="legend-item"><span className="dot dot-pending" /> Pending</span>
                <span className="legend-item"><span className="dot dot-unbilled" /> Unbilled</span>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th className="sticky-col font-heading">ROLL NO &amp; STUDENT</th>
                    {ACADEMIC_MONTHS.map((m) => (
                      <th key={m} className="month-col font-heading">{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupStudents.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="empty-state">
                        No enrolled students found in group {currentGroup?.name}.
                      </td>
                    </tr>
                  ) : (
                    groupStudents.map((s) => (
                      <tr key={s.id}>
                        <td className="sticky-col student-sticky-cell">
                          <span className="roll-no font-heading">{s.roll_number || s.roll_no}</span>
                          <span className="student-name">{s.name}</span>
                        </td>
                        {ACADEMIC_MONTHS.map((month) => {
                          const record = getFeeRecord(s.id, month);
                          const status = record?.status || 'UNPAID';

                          return (
                            <td 
                              key={month} 
                              className="cell-clickable"
                              onClick={() => handleCellClick(s, month)}
                            >
                              {status === 'PAID' && (
                                <div className="status-chip chip-paid">
                                  <Check size={12} />
                                  <span>Paid</span>
                                </div>
                              )}
                              {status === 'PENDING' && (
                                <div className="status-chip chip-pending">
                                  <Clock size={12} />
                                  <span>PENDING</span>
                                </div>
                              )}
                              {status === 'UNPAID' && (
                                <div className="status-chip chip-unbilled">
                                  <Minus size={12} />
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Ledger Summary Metric Cards matching Figma Node 204:2131 */}
            <div className="matrix-summary-cards">
              <div className="summary-card">
                <span className="summary-label">TOTAL COLLECTED</span>
                <span className="summary-val text-green font-heading">Rs {totalCollected.toLocaleString()}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">PENDING DUES</span>
                <span className="summary-val text-red font-heading">Rs {pendingDues.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Fee Payment Entry Confirmation Modal */}
      {selectedCell && (
        <div className="modal-overlay">
          <div className="modal-content card animate-fade-in">
            <div className="modal-header">
              <div>
                <span className="modal-badge font-heading">PAYMENT CONFIRMATION</span>
                <h3 className="modal-title">{selectedCell.student.name}</h3>
                <p className="modal-sub">
                  Roll: {selectedCell.student.roll_number || selectedCell.student.roll_no} · {selectedCell.month} 2026 Fee
                </p>
              </div>
              <button className="close-btn" onClick={() => setSelectedCell(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="input-label">Tuition Fee Amount (INR)</label>
                <input
                  type="number"
                  className="input-field amount-input font-heading"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="input-label">Payment Mode</label>
                <div className="payment-modes-grid">
                  {(['UPI', 'CASH', 'BANK'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={`mode-btn ${paymentMode === mode ? 'active' : ''}`}
                      onClick={() => setPaymentMode(mode)}
                    >
                      <CreditCard size={14} />
                      <span>{mode}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => handleConfirmPayment('PENDING')}
              >
                Mark Pending
              </button>

              <button 
                type="button" 
                className="btn-primary" 
                onClick={() => handleConfirmPayment('PAID')}
              >
                <Sparkles size={16} />
                <span>Confirm Payment (Paid)</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          padding-bottom: 80px;
        }

        .page-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
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

        .action-buttons-group {
          display: flex;
          gap: 12px;
        }

        .filters-control-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .group-pills-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
          flex: 1;
          scrollbar-width: thin;
        }

        .year-selector-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          padding: 6px 14px;
          border-radius: 20px;
        }

        .year-label {
          font-size: 11px;
          font-weight: 800;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
        }

        .year-select-dropdown {
          background: transparent;
          border: none;
          color: var(--accent-yellow);
          font-size: 14px;
          font-weight: 800;
          outline: none;
          cursor: pointer;
        }

        .group-pill-btn {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .group-pill-btn.active, .group-pill-btn:hover {
          background-color: var(--accent-yellow);
          color: #070A16;
          border-color: var(--accent-yellow);
        }

        .count-badge {
          background-color: rgba(7, 10, 22, 0.3);
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 11px;
        }

        .matrix-card {
          padding: 0;
          overflow: hidden;
        }

        .matrix-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-surface);
        }

        .matrix-title {
          font-size: 14px;
          color: var(--text-primary);
          letter-spacing: 0.5px;
        }

        .legend {
          display: flex;
          gap: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot-paid { background-color: #10B981; }
        .dot-pending { background-color: #EF4444; }
        .dot-unbilled { background-color: var(--border-color); }

        .table-wrapper {
          overflow-x: auto;
          width: 100%;
        }

        .matrix-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }

        .matrix-table th {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          padding: 12px 14px;
          text-align: center;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-surface);
        }

        .sticky-col {
          position: sticky;
          left: 0;
          background-color: var(--bg-surface);
          z-index: 10;
          text-align: left !important;
          min-width: 180px;
          border-right: 1px solid var(--border-color);
        }

        .student-sticky-cell {
          display: flex;
          flex-direction: column;
          padding: 12px 16px;
        }

        .roll-no {
          font-size: 12px;
          font-weight: 800;
          color: var(--accent-yellow);
        }

        .student-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .matrix-table td {
          padding: 10px 8px;
          text-align: center;
          border-bottom: 1px solid var(--border-color);
          border-right: 1px solid rgba(255, 255, 255, 0.03);
        }

        .cell-clickable {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .cell-clickable:hover {
          background-color: var(--bg-surface-hover);
        }

        .status-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 700;
          width: 72px;
        }

        .chip-paid {
          background-color: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .chip-pending {
          background-color: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .chip-unbilled {
          color: var(--text-muted);
          background-color: rgba(255, 255, 255, 0.03);
        }

        .matrix-summary-cards {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding: 20px 24px;
          background-color: var(--bg-surface);
          border-top: 1px solid var(--border-color);
        }

        .summary-card {
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 12px 20px;
          display: flex;
          flex-direction: column;
          min-width: 180px;
        }

        .summary-label {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .summary-val {
          font-size: 20px;
          font-weight: 800;
        }

        .text-green { color: #10B981; }
        .text-red { color: #EF4444; }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(7, 10, 22, 0.85);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 440px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 28px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .modal-badge {
          font-size: 11px;
          color: var(--accent-yellow);
          letter-spacing: 0.5px;
        }

        .modal-title {
          font-size: 20px;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .modal-sub {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .input-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .amount-input {
          font-size: 20px;
          font-weight: 800;
          color: var(--accent-yellow);
        }

        .payment-modes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .mode-btn {
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 10px;
          border-radius: var(--radius-md);
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-btn.active, .mode-btn:hover {
          border-color: var(--accent-yellow);
          color: var(--accent-yellow);
          background-color: var(--accent-yellow-subtle);
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 24px;
        }

        @media (max-width: 1024px) {
          .main-layout {
            margin-left: 0;
            padding-bottom: 90px;
          }
          .content-area {
            padding: 16px 16px 90px 16px;
          }
          .matrix-summary-cards {
            flex-direction: row;
            justify-content: space-between;
          }
          .summary-card {
            width: 48%;
            min-width: unset;
          }
          .desktop-only {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
