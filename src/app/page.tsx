'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { NewAdmissionModal } from '@/components/NewAdmissionModal';
import { DataService } from '@/lib/dataService';
import { DashboardKPIs, Student } from '@/lib/types';
import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    const data = DataService.getDashboardKPIs();
    setKpis(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="app-container">
      <Sidebar onOpenNewAdmission={() => setIsModalOpen(true)} />
      <div className="main-layout">
        <Header onOpenNewAdmission={() => setIsModalOpen(true)} />

        <main className="content-area animate-fade-in">
          <div className="page-header">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Art School Performance Overview</p>
          </div>

          {/* Top KPI Cards Grid */}
          <div className="kpi-grid">
            {/* KPI Card 1 */}
            <div className="card kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Active Students</span>
                <span className="growth-badge">+12%</span>
              </div>
              <div className="kpi-value">{kpis?.totalActiveStudents || 142}</div>
              <div className="kpi-desc">Active enrollments across all groups</div>
            </div>

            {/* KPI Card 2 (Standard Card Matching Figma Node 204:67) */}
            <div className="card kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Pending Fees (Month)</span>
                <span className="overdue-badge">Overdue</span>
              </div>
              <div className="kpi-value text-red">
                Rs {kpis?.pendingFeesAmount ? kpis.pendingFeesAmount.toLocaleString() : '1,250'}
              </div>
              <div className="kpi-desc text-red-subtle">
                {kpis?.pendingStudentsCount || 15} students overdue this period
              </div>
            </div>

            {/* KPI Card 3 */}
            <div className="card kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Monthly Admissions</span>
                <span className="target-label">Target: {kpis?.monthlyAdmissionsTarget || 25}</span>
              </div>
              <div className="kpi-value">{kpis?.monthlyAdmissionsCount || 18}</div>
              <div className="progress-bar-container">
                <div 
                  className="progress-fill-yellow"
                  style={{ width: `${((kpis?.monthlyAdmissionsCount || 18) / (kpis?.monthlyAdmissionsTarget || 25)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Middle Section: Recent Admissions & Revenue Forecast */}
          <div className="dashboard-columns">
            {/* Recent Admissions Table */}
            <div className="card admissions-card">
              <div className="card-header">
                <h3 className="section-heading">RECENT ADMISSIONS</h3>
                <Link href="/students" className="view-all-link">
                  View All <ChevronRight size={16} />
                </Link>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>STUDENT NAME</th>
                      <th>ART CLASS GROUP</th>
                      <th>ADMISSION DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpis?.recentAdmissions.map((student: Student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-cell">
                            <div className="avatar-sm font-heading">
                              {student.name.charAt(0)}
                            </div>
                            <span className="student-name">{student.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="group-badge">{student.group_name}</span>
                        </td>
                        <td className="date-cell">{student.registered_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Forecast Bar Chart */}
            <div className="card chart-card">
              <div className="card-header">
                <h3 className="section-heading">Revenue Forecast</h3>
                <span className="peak-badge">Peak Rs 4.2k</span>
              </div>

              <div className="chart-container">
                {kpis?.revenueForecast.map((item) => {
                  const maxHeight = 160;
                  const height = (item.amount / 4200) * maxHeight;
                  return (
                    <div key={item.month} className="bar-wrapper">
                      <div className="bar-val font-heading">Rs {item.amount}</div>
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{ height: `${height}px` }} 
                        />
                      </div>
                      <span className="bar-month">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {/* Floating Action Button for Mobile matching Figma Node 204:1938 */}
        <button
          className="mobile-fab-btn"
          onClick={() => setIsModalOpen(true)}
          aria-label="New Admission"
        >
          <Plus size={18} />
          <span>New Admission</span>
        </button>

      </div>

      <NewAdmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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

        .page-header {
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

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        .kpi-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 140px;
        }

        .kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .kpi-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .growth-badge {
          background-color: var(--status-active-bg);
          color: var(--status-active-text);
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }

        .overdue-badge {
          background-color: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .target-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .kpi-value {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 36px;
          color: var(--text-primary);
          line-height: 1;
        }

        .text-red {
          color: #EF4444;
        }

        .text-red-subtle {
          color: rgba(239, 68, 68, 0.8);
        }

        .kpi-desc {
          font-size: 12px;
          color: var(--text-muted);
        }

        .progress-bar-container {
          width: 100%;
          height: 8px;
          background-color: var(--bg-deep);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 8px;
        }

        .progress-fill-yellow {
          height: 100%;
          background-color: var(--accent-yellow);
          border-radius: 4px;
        }

        .dashboard-columns {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 20px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-heading {
          font-size: 16px;
          color: var(--text-primary);
          letter-spacing: 0.5px;
          font-family: var(--font-heading);
        }

        .view-all-link {
          color: var(--accent-yellow);
          text-decoration: none !important;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.2s ease;
        }
        .view-all-link:hover {
          gap: 8px;
        }

        .peak-badge {
          background-color: var(--accent-yellow-subtle);
          color: var(--accent-yellow);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .data-table th {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          letter-spacing: 0.5px;
        }

        .data-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
          font-size: 14px;
          color: var(--text-primary);
        }

        .student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-sm {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--accent-yellow-subtle);
          border: 1px solid var(--accent-yellow);
          color: var(--accent-yellow);
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .student-name {
          font-weight: 600;
        }

        .group-badge {
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .date-cell {
          color: var(--text-secondary);
          font-size: 13px;
        }

        .chart-container {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 220px;
          padding-top: 20px;
        }

        .bar-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 14%;
        }

        .bar-val {
          font-size: 9px;
          color: var(--text-muted);
        }

        .bar-track {
          width: 24px;
          height: 160px;
          background-color: var(--bg-deep);
          border-radius: 12px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .bar-fill {
          width: 100%;
          background: linear-gradient(180deg, #FCD602 0%, rgba(252, 214, 2, 0.4) 100%);
          border-radius: 12px;
          transition: height 0.4s ease;
        }

        .bar-month {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .mobile-fab-btn {
          display: none;
          position: fixed;
          bottom: 80px;
          right: 20px;
          background-color: var(--accent-yellow);
          color: #070A16;
          border: none;
          border-radius: 28px;
          padding: 12px 20px;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 13px;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(252, 214, 2, 0.4);
          z-index: 45;
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .main-layout {
            margin-left: 0;
            padding-bottom: 90px;
          }
          .content-area {
            padding: 20px 16px 90px 16px;
          }
          .kpi-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-columns {
            grid-template-columns: 1fr;
          }
          .mobile-fab-btn {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
}
