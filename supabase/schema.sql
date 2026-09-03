-- Aakritee Art School - Ledger Supabase Database Schema

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Art Class Groups Table
CREATE TABLE IF NOT EXISTS art_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(100),
    prefix_id INT NOT NULL,
    active_headcount INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_no VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    guardian_name VARCHAR(150),
    dob DATE,
    gender VARCHAR(20),
    phone VARCHAR(30),
    group_id UUID REFERENCES art_groups(id) ON DELETE SET NULL,
    group_name VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Fee Ledger Table
CREATE TABLE IF NOT EXISTS fee_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    year INT NOT NULL DEFAULT 2026,
    period VARCHAR(20) NOT NULL, -- 'Jan', 'Feb', ..., 'Dec', 'EXAM_FEE', 'BULK_FEE'
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PAID', 'PENDING', 'UNPAID'
    amount DECIMAL(10, 2) DEFAULT 1500.00,
    paid_date DATE,
    payment_mode VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_year_period UNIQUE (student_id, year, period)
);

-- 4. Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Default Initial Art Groups Data
INSERT INTO art_groups (name, code, prefix_id, active_headcount) VALUES
('Cp-J', 'JUNIOR SKETCHING', 1, 45),
('Cp-L', 'LANDSCAPE ART', 2, 38),
('Cp-U', 'URBAN DESIGN', 3, 32),
('C', 'COMMERCIAL ART', 4, 27),
('B', 'ADVANCED OIL PAINTING', 5, 52),
('A', 'FINE ARTS MASTER', 6, 20),
('A+', 'PORTRAIT & MODELING', 7, 15),
('1st Yr', 'FOUNDATION YEAR', 8, 12),
('2nd Yr', 'INTERMEDIATE DIPLOMA', 9, 10),
('3rd Yr', 'ADVANCED DEGREE', 10, 8),
('Sp', 'SPECIALIZATION LAB', 11, 5)
ON CONFLICT (name) DO NOTHING;

-- Default Settings Data
INSERT INTO settings (key, value) VALUES
('payment_modes', '[{"name": "UPI / GPay / PhonePe", "active": true}, {"name": "Cash Payments", "active": true}, {"name": "Bank Transfer", "active": true}]'::jsonb),
('academic_session', '{"current_year": 2026, "session_label": "2025-26", "target_admissions": 25}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Row Level Security (RLS) Policies (Enable Public Access for Ledger Admin App)
ALTER TABLE art_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read/write on art_groups" ON art_groups FOR ALL USING (true);
CREATE POLICY "Allow anonymous read/write on students" ON students FOR ALL USING (true);
CREATE POLICY "Allow anonymous read/write on fee_ledger" ON fee_ledger FOR ALL USING (true);
CREATE POLICY "Allow anonymous read/write on settings" ON settings FOR ALL USING (true);
