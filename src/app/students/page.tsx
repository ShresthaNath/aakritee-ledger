'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { NewAdmissionModal } from '@/components/NewAdmissionModal';
import { EditStudentModal } from '@/components/EditStudentModal';
import { DataService } from '@/lib/dataService';
import { Student, StudentStatus } from '@/lib/types';
import { Search, Filter, Trash2, Edit2, Phone, MessageSquare } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [isNewAdmissionOpen, setIsNewAdmissionOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'directory' | 'admission'>('directory');

  const loadData = () => {
    setStudents(DataService.getStudents());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = (id: string) => {
    DataService.toggleStudentStatus(id);
    loadData();
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student profile?')) {
      DataService.deleteStudent(id);
      loadData();
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.roll_no && s.roll_no.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGroup = selectedGroup === 'ALL' || s.group_id === selectedGroup || s.group_name === selectedGroup;

    return matchesSearch && matchesGroup;
  });

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-layout">
        <Header
          onOpenNewAdmission={() => setIsNewAdmissionOpen(true)}
          onSearchChange={setSearchQuery}
        />

        <main className="content-area animate-fade-in">
          {/* Header Controls */}
          <div className="page-header-row">
            <div>
              <h1 className="page-title">Student Directory</h1>
              <p className="page-subtitle">Manage student profiles, enrollments, and status tracking</p>
            </div>

            {/* Toggle Bar matching Figma Node 204:2032 */}
            <div className="toggle-pill-container font-heading">
              <button
                className={`toggle-tab ${activeTab === 'admission' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('admission');
                  setIsNewAdmissionOpen(true);
                }}
              >
                New Admission
              </button>
              <button
                className={`toggle-tab ${activeTab === 'directory' ? 'active' : ''}`}
                onClick={() => setActiveTab('directory')}
              >
                Directory
              </button>
            </div>
          </div>

          {/* Search & Group Filter Bar */}
          <div className="filter-bar">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search by student name or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="select-field"
              >
                <option value="ALL">All Art Class Groups</option>
                <option value="Cp-J">Cp-J (Junior Sketching)</option>
                <option value="Cp-L">Cp-L (Landscape)</option>
                <option value="Cp-U">Cp-U (Urban Sketching)</option>
                <option value="C">C (Composition)</option>
                <option value="B">B (Watercolor)</option>
                <option value="A">A (Acrylics)</option>
                <option value="A+">A+ (Portfolio Masterclass)</option>
              </select>

              <button className="btn-secondary filter-btn">
                <Filter size={16} />
                <span className="desktop-only">More Filters</span>
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="card table-card desktop-only-table">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ROLL NO</th>
                    <th>STUDENT NAME</th>
                    <th>GUARDIAN / PHONE</th>
                    <th>CLASS GROUP</th>
                    <th>REG. DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-state">
                        No student profiles match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id}>
                        <td className="roll-cell font-heading">{s.roll_number || s.roll_no}</td>
                        <td>
                          <div className="student-name-box">
                            <span className="name-text">{s.name}</span>
                            <span className="sub-text">DOB: {s.dob} ({s.gender})</span>
                          </div>
                        </td>
                        <td>
                          <div className="phone-box">
                            <span className="guardian-text">{s.guardian_name}</span>
                            <a
                              href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="phone-link"
                            >
                              <MessageSquare size={13} className="wa-icon" />
                              <span>{s.phone}</span>
                            </a>
                          </div>
                        </td>
                        <td>
                          <span className="group-chip">{s.group_name}</span>
                        </td>
                        <td className="date-cell">{s.registered_date}</td>
                        <td>
                          <button
                            onClick={() => handleToggleStatus(s.id)}
                            className={`status-chip ${s.status === 'Active' ? 'status-active' : 'status-inactive'}`}
                          >
                            {s.status}
                          </button>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="icon-btn edit"
                              title="Edit Student"
                              onClick={() => setStudentToEdit(s)}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="icon-btn delete"
                              title="Delete Student"
                              onClick={() => handleDeleteStudent(s.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Student Cards View matching Figma Node 204:2032 */}
          <div className="mobile-students-list">
            {filteredStudents.length === 0 ? (
              <div className="card empty-card">No students found</div>
            ) : (
              filteredStudents.map((s) => (
                <div key={s.id} className="card mobile-student-card">
                  <div className="mobile-card-top">
                    <span className="mobile-roll font-heading">{s.roll_number || s.roll_no} · {s.group_name}</span>
                    <button
                      onClick={() => handleToggleStatus(s.id)}
                      className={`status-chip ${s.status === 'Active' ? 'status-active' : 'status-inactive'}`}
                    >
                      {s.status}
                    </button>
                  </div>
                  <h3 className="mobile-student-name">{s.name}</h3>
                  <p className="mobile-guardian">Guardian: {s.guardian_name} ({s.phone})</p>

                  <div className="mobile-card-bottom">
                    <span className="mobile-reg-date">Registered {s.registered_date}</span>
                    <div className="action-buttons">
                      <button className="icon-btn edit" onClick={() => setStudentToEdit(s)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDeleteStudent(s.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <EditStudentModal
        isOpen={Boolean(studentToEdit)}
        student={studentToEdit}
        onClose={() => setStudentToEdit(null)}
        onStudentUpdated={loadData}
      />

      <NewAdmissionModal
        isOpen={isNewAdmissionOpen}
        onClose={() => {
          setIsNewAdmissionOpen(false);
          setActiveTab('directory');
        }}
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

        .toggle-pill-container {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          padding: 4px;
          border-radius: 24px;
          display: flex;
          gap: 4px;
        }

        .toggle-tab {
          padding: 8px 18px;
          border-radius: 20px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-tab.active {
          background-color: var(--accent-yellow);
          color: #070A16;
        }

        .filter-bar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
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

        .filter-input {
          width: 100%;
          height: 42px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding-left: 44px;
          padding-right: 16px;
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .filter-input:focus {
          border-color: var(--accent-yellow);
        }

        .filter-group {
          display: flex;
          gap: 12px;
        }

        .select-field {
          height: 42px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .filter-btn {
          height: 42px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .table-card {
          padding: 0;
          overflow: hidden;
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
          padding: 14px 20px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          letter-spacing: 0.5px;
        }

        .data-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          font-size: 14px;
          color: var(--text-primary);
        }

        .roll-cell {
          font-weight: 800;
          color: var(--accent-yellow);
        }

        .student-name-box {
          display: flex;
          flex-direction: column;
        }

        .name-text {
          font-weight: 600;
          color: var(--text-primary);
        }

        .sub-text {
          font-size: 11px;
          color: var(--text-muted);
        }

        .phone-box {
          display: flex;
          flex-direction: column;
        }

        .guardian-text {
          font-weight: 500;
        }

        .phone-link {
          font-size: 12px;
          color: #25D366;
          text-decoration: none !important;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .group-chip {
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .date-cell {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .status-chip {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }

        .status-active {
          background-color: var(--status-active-bg);
          color: var(--status-active-text);
        }

        .status-inactive {
          background-color: rgba(160, 165, 181, 0.2);
          color: var(--text-muted);
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-btn.edit:hover {
          border-color: var(--accent-yellow);
          color: var(--accent-yellow);
        }

        .icon-btn.delete:hover {
          border-color: #EF4444;
          color: #EF4444;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: var(--text-muted);
        }

        /* Mobile specific card styles */
        .mobile-students-list {
          display: none;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-student-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-roll {
          font-size: 12px;
          font-weight: 700;
          color: var(--accent-yellow);
        }

        .mobile-student-name {
          font-size: 16px;
          color: var(--text-primary);
          margin: 0;
        }

        .mobile-guardian {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 0;
        }

        .mobile-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--border-color);
        }

        .mobile-reg-date {
          font-size: 11px;
          color: var(--text-muted);
        }

        .desktop-only-table {
          display: block;
        }

        @media (max-width: 768px) {
          .main-layout {
            margin-left: 0;
            padding-bottom: 90px;
          }
          .content-area {
            padding: 16px 16px 90px 16px;
          }
          .page-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .filter-bar {
            flex-direction: column;
          }
          .desktop-only-table {
            display: none;
          }
          .mobile-students-list {
            display: flex;
          }
          .desktop-only {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
