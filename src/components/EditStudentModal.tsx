'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, UserCheck } from 'lucide-react';
import { Student, ArtGroup } from '@/lib/types';
import { DataService } from '@/lib/dataService';

interface EditStudentModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onStudentUpdated: () => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  student,
  onClose,
  onStudentUpdated,
}) => {
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [groups, setGroups] = useState<ArtGroup[]>([]);

  useEffect(() => {
    setGroups(DataService.getGroups());
    if (student) {
      setFormData({ ...student });
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    DataService.updateStudent({
      ...student,
      ...formData,
      name: formData.name || student.name,
      guardian_name: formData.guardian_name || student.guardian_name,
      phone: formData.phone || student.phone,
      dob: formData.dob || student.dob,
      gender: formData.gender || student.gender,
      group_id: formData.group_id || student.group_id,
      group_name: formData.group_name || student.group_name,
      roll_number: formData.roll_number || student.roll_number,
      roll_no: formData.roll_number || student.roll_number,
      status: formData.status || student.status,
    });

    onStudentUpdated();
    onClose();
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGroupId = e.target.value;
    const selectedGroup = groups.find((g) => g.id === selectedGroupId);
    setFormData((prev) => ({
      ...prev,
      group_id: selectedGroupId,
      group_name: selectedGroup ? selectedGroup.name : prev.group_name,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card animate-fade-in">
        <div className="modal-header">
          <div>
            <span className="modal-badge font-heading">STUDENT PROFILE EDIT</span>
            <h2 className="modal-title">Edit {student.name}</h2>
            <p className="modal-subtitle">Update student record details without changing historical ledger data</p>
          </div>
          <button className="close-btn" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="input-label">ROLL NO (READ-ONLY)</label>
              <input
                type="text"
                className="input-field roll-field font-heading"
                value={formData.roll_number || formData.roll_no || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="input-label">ART CLASS GROUP</label>
              <select
                className="select-field"
                value={formData.group_id || ''}
                onChange={handleGroupChange}
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.code || 'Group'})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label className="input-label">STUDENT FULL NAME *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="input-label">GUARDIAN NAME *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.guardian_name || ''}
                onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="input-label">WHATSAPP / PHONE NO *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="input-label">DATE OF BIRTH</label>
              <input
                type="date"
                className="input-field"
                value={formData.dob || ''}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="input-label">GENDER</label>
              <select
                className="select-field"
                value={formData.gender || 'Female'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">STATUS</label>
              <select
                className="select-field"
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Save Student Changes</span>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
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
          max-width: 580px;
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
          font-weight: 700;
        }

        .modal-title {
          font-size: 20px;
          color: var(--text-primary);
          margin-top: 2px;
        }

        .modal-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .full-width {
          grid-column: span 2;
        }

        .input-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .input-field,
        .select-field {
          width: 100%;
          height: 42px;
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          padding: 0 14px;
          font-size: 13px;
          outline: none;
        }

        .roll-field {
          color: var(--accent-yellow);
          font-weight: 800;
          opacity: 0.85;
        }

        .input-field:focus,
        .select-field:focus {
          border-color: var(--accent-yellow);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};
