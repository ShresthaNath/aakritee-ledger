'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { DataService } from '@/lib/dataService';
import { ArtGroup, Student } from '@/lib/types';
import confetti from 'canvas-confetti';

interface NewAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded?: (student: Student) => void;
}

export const NewAdmissionModal: React.FC<NewAdmissionModalProps> = ({
  isOpen,
  onClose,
  onStudentAdded,
}) => {
  const [groups, setGroups] = useState<ArtGroup[]>([]);
  const [name, setName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [dob, setDob] = useState('2016-04-12');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('+91 98100 23456');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [autoRollNo, setAutoRollNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const groupList = DataService.getGroups();
      setGroups(groupList);
      if (groupList.length > 0) {
        // Default to Group B (Code 5) or first group
        const targetGroup = groupList.find(g => g.name === 'B') || groupList[0];
        setSelectedGroupId(targetGroup.id);
        const roll = DataService.generateRollNumber(targetGroup.id);
        setAutoRollNo(roll);
      }
    }
  }, [isOpen]);

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    const roll = DataService.generateRollNumber(groupId);
    setAutoRollNo(roll);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedGroupId) return;

    setIsSubmitting(true);

    const newStudent = DataService.addStudent({
      roll_number: autoRollNo,
      roll_no: autoRollNo,
      name,
      guardian_name: guardianName || 'Guardian',
      dob,
      gender,
      phone,
      group_id: selectedGroupId,
      group_name: groups.find(g => g.id === selectedGroupId)?.name || 'Cp-J',
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      if (onStudentAdded) onStudentAdded(newStudent);
      onClose();
      // Reset form
      setName('');
      setGuardianName('');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card animate-fade-in">
        <div className="modal-header">
          <div>
            <div className="breadcrumb">Student Management &gt; New Admission</div>
            <h2 className="modal-title">New Student Admission</h2>
            <p className="modal-subtitle">Register a new student and automatically assign roll number</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="step-bar">
          <div className="step-text">
            <span>Step 1 of 2</span>
            <span className="step-percent">40% Complete</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '40%' }} />
          </div>
        </div>

        {/* Art Class Groups & Roll Reference Pills */}
        <div className="groups-reference font-heading">
          <span className="ref-label">ART CLASS GROUPS &amp; ROLL REFERENCE</span>
          <div className="pills-row">
            {groups.slice(0, 7).map((g) => (
              <button
                key={g.id}
                type="button"
                className={`group-pill ${selectedGroupId === g.id ? 'active' : ''}`}
                onClick={() => handleGroupChange(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admission-form">
          {/* SECTION 1 */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="bullet">•</span> SECTION 1 — Student Information
            </h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="input-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Malhotra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="input-label">Guardian / Parent Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanjay Malhotra"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="input-label">DOB *</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label className="input-label">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input-field"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="input-label">Phone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98100 23456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="form-section">
            <h3 className="section-title">
              <span className="bullet">•</span> SECTION 2 — Academic Assignment
            </h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="input-label">Art Class Group *</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  className="input-field"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Roll Number (Auto-Generated) *</label>
                <div className="auto-roll-box">
                  <Sparkles size={16} className="roll-icon" />
                  <span>{autoRollNo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn-secondary">
              Save as Draft
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {showSuccess ? (
                <>
                  <CheckCircle size={18} />
                  <span>Admitted!</span>
                </>
              ) : (
                <span>Submit Admission</span>
              )}
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
          background: rgba(7, 10, 22, 0.85);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 820px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 32px;
          box-shadow: var(--shadow-md);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .breadcrumb {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .modal-title {
          font-size: 24px;
          color: var(--text-primary);
        }

        .modal-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          transition: color 0.2s ease;
        }
        .close-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface-hover);
        }

        .step-bar {
          margin-bottom: 24px;
        }

        .step-text {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .step-percent {
          color: var(--accent-yellow);
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background-color: var(--bg-deep);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background-color: var(--accent-yellow);
          border-radius: 3px;
        }

        .groups-reference {
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 28px;
        }

        .ref-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 10px;
        }

        .pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .group-pill {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .group-pill.active, .group-pill:hover {
          border-color: var(--accent-yellow);
          color: var(--accent-yellow);
          background-color: var(--accent-yellow-subtle);
        }

        .form-section {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bullet {
          color: var(--accent-yellow);
          font-size: 18px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .full-width {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .input-field {
          width: 100%;
          height: 44px;
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          padding: 0 14px;
          font-size: 14px;
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .input-field option {
          background-color: var(--bg-surface);
          color: var(--text-primary);
        }

        .input-field:focus {
          border-color: var(--accent-yellow);
        }

        .auto-roll-box {
          width: 100%;
          height: 44px;
          background-color: var(--bg-deep);
          border: 1px solid var(--border-color);
          color: var(--accent-yellow);
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 15px;
          padding: 0 14px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 10px;
          box-sizing: border-box;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        @media (max-width: 640px) {
          .modal-overlay {
            padding: 10px;
            align-items: flex-end;
          }
          .modal-card {
            max-height: 90vh;
            overflow-y: auto;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            padding: 20px;
          }
          .grid-2 {
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
