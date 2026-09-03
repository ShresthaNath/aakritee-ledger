'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { NewAdmissionModal } from '@/components/NewAdmissionModal';
import { EditStudentModal } from '@/components/EditStudentModal';
import { DataService } from '@/lib/dataService';
import { Student } from '@/lib/types';
import { Search, Filter, Trash2, Edit2, MessageSquare } from 'lucide-react';

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
      <Sidebar onOpenNewAdmission={() => setIsNewAdmissionOpen(true)} />
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
                <option value="Cp-J">Cp-J</option>
                <option value="Cp-L">Cp-L</option>
                <option value="Cp-U">Cp-U</option>
                <option value="C">C</option>
                <option value="B">B</option>
                <option value="A">A</option>
                <option value="A+">A+</option>
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
                  <div className="mobile-guardian-row">
                    <span className="guardian-label">Guardian: {s.guardian_name}</span>
                    <a
                      href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mobile-wa-link"
                    >
                      <MessageSquare size={13} className="wa-icon" />
                      <span>{s.phone}</span>
                    </a>
                  </div>

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
          display: flex;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 4px;
          gap: 4px;
        }

        .toggle-tab {
          padding: 8px 20px;
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
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        :global(.search-icon) {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .filter-input {
          width: 100%;
          height: 42px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding-left: 42px;
          padding-right: 16px;
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
        }

        .filter-input:focus {
          border-color: var(--accent-yellow);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .select-field {
          height: 42px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 0 16px;
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .table-card {
          padding: 0;
          overflow: hidden;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .data-table th {
          background-color: var(--bg-surface-hover);
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
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
          font-size: 12px;
          color: var(--text-muted);
        }

        .phone-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .guardian-text {
          font-weight: 500;
        }

        .phone-link, .mobile-wa-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #22C55E;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .phone-link:hover, .mobile-wa-link:hover {
          text-decoration: underline;
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
          color: var(--text-secondary);
          font-size: 13px;
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
          background-color: rgba(34, 197, 94, 0.15);
          color: #22C55E;
        }

        .status-inactive {
          background-color: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-btn.edit:hover {
          color: var(--accent-yellow);
          border-color: var(--accent-yellow);
          background-color: var(--accent-yellow-subtle);
        }

        .icon-btn.delete:hover {
          color: #EF4444;
          border-color: #EF4444;
          background-color: rgba(239, 68, 68, 0.1);
        }

        .empty-state {
          text-align: center;
          color: var(--text-muted);
          padding: 40px !important;
        }

        .mobile-students-list {
          display: none;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-student-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mobile-roll {
          font-size: 13px;
          font-weight: 800;
          color: var(--accent-yellow);
        }

        .mobile-student-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .mobile-guardian-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .guardian-label {
          color: var(--text-secondary);
        }

        .mobile-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }

        .mobile-reg-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .main-layout {
            margin-left: 0;
          }
          .content-area {
            padding: 16px;
          }
          .desktop-only-table {
            display: none;
          }
          .mobile-students-list {
            display: flex;
          }
          .page-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .search-box {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
