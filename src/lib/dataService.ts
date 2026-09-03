import { ArtGroup, Student, FeeRecord, PaymentModeSetting, DashboardKPIs } from './types';

// Initial Mock Seed Data matching Figma Designs
const INITIAL_GROUPS: ArtGroup[] = [
  { id: 'g-1', name: 'Cp-J', code: 'JUNIOR SKETCHING', prefix_id: 1, active_headcount: 45 },
  { id: 'g-2', name: 'Cp-L', code: 'LANDSCAPE SKETCHING', prefix_id: 2, active_headcount: 38 },
  { id: 'g-3', name: 'Cp-U', code: 'URBAN SKETCHING', prefix_id: 3, active_headcount: 32 },
  { id: 'g-4', name: 'C', code: 'ADVANCED COMPOSITION', prefix_id: 4, active_headcount: 27 },
  { id: 'g-5', name: 'B', code: 'WATERCOLOR BASICS', prefix_id: 5, active_headcount: 52 },
  { id: 'g-6', name: 'A', code: 'ACRYLICS & CANVAS', prefix_id: 6, active_headcount: 20 },
  { id: 'g-7', name: 'A+', code: 'PORTFOLIO MASTERCLASS', prefix_id: 7, active_headcount: 15 },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 's-1',
    group_id: 'g-1',
    group_name: 'Cp-J',
    roll_number: '1-1',
    roll_no: '1-1',
    name: 'Rohan Sharma',
    guardian_name: 'Sanjay Sharma',
    dob: '2014-06-12',
    phone: '+91 98100 23456',
    gender: 'Male',
    registered_date: '20/06/26',
    status: 'Active',
  },
  {
    id: 's-2',
    group_id: 'g-1',
    group_name: 'Cp-J',
    roll_number: '1-2',
    roll_no: '1-2',
    name: 'Aanya Verma',
    guardian_name: 'Vikram Verma',
    dob: '2015-03-18',
    phone: '+91 98765 43210',
    gender: 'Female',
    registered_date: '18/06/26',
    status: 'Active',
  },
  {
    id: 's-3',
    group_id: 'g-5',
    group_name: 'B',
    roll_number: '5-1',
    roll_no: '5-1',
    name: 'Ananya Kapoor',
    guardian_name: 'Rajesh Kapoor',
    dob: '2013-09-05',
    phone: '+91 98111 55443',
    gender: 'Female',
    registered_date: '18/06/26',
    status: 'Active',
  },
  {
    id: 's-4',
    group_id: 'g-5',
    group_name: 'B',
    roll_number: '5-2',
    roll_no: '5-2',
    name: 'Rohan Verma',
    guardian_name: 'Mahesh Verma',
    dob: '2012-11-22',
    phone: '+91 99000 11223',
    gender: 'Male',
    registered_date: '15/06/26',
    status: 'Active',
  },
  {
    id: 's-5',
    group_id: 'g-2',
    group_name: 'Cp-L',
    roll_number: '2-1',
    roll_no: '2-1',
    name: 'Kabir Mehta',
    guardian_name: 'Sunil Mehta',
    dob: '2014-01-30',
    phone: '+91 98333 44556',
    gender: 'Male',
    registered_date: '10/06/26',
    status: 'Active',
  },
];

const INITIAL_FEE_RECORDS: FeeRecord[] = [
  { id: 'f-1', student_id: 's-1', year: 2026, fee_period: 'JAN', month: 'JAN', status: 'PAID', amount: 500, payment_mode: 'UPI', payment_date: '2026-01-05' },
  { id: 'f-2', student_id: 's-1', year: 2026, fee_period: 'FEB', month: 'FEB', status: 'PAID', amount: 500, payment_mode: 'CASH', payment_date: '2026-02-04' },
  { id: 'f-3', student_id: 's-1', year: 2026, fee_period: 'MAR', month: 'MAR', status: 'PENDING', amount: 500 },
  { id: 'f-4', student_id: 's-2', year: 2026, fee_period: 'JAN', month: 'JAN', status: 'PAID', amount: 500, payment_mode: 'UPI', payment_date: '2026-01-07' },
  { id: 'f-5', student_id: 's-2', year: 2026, fee_period: 'FEB', month: 'FEB', status: 'PENDING', amount: 500 },
  { id: 'f-6', student_id: 's-3', year: 2026, fee_period: 'JAN', month: 'JAN', status: 'PAID', amount: 500, payment_mode: 'BANK', payment_date: '2026-01-02' },
];

const INITIAL_PAYMENT_MODES: PaymentModeSetting[] = [
  { id: 'pm-1', name: 'UPI / GPay / PhonePe', enabled: true },
  { id: 'pm-2', name: 'Cash Payments', enabled: true },
  { id: 'pm-3', name: 'Bank Transfer', enabled: false },
];

export class DataService {
  private static getStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(`aakritee_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  }

  private static setStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`aakritee_${key}`, JSON.stringify(value));
  }

  public static getGroups(): ArtGroup[] {
    return this.getStorage<ArtGroup[]>('groups', INITIAL_GROUPS);
  }

  public static addGroup(name: string, code?: string, prefix_id?: number): ArtGroup {
    const groups = this.getGroups();
    const newGroup: ArtGroup = {
      id: `g-${Date.now()}`,
      name,
      code: code || `${name} ART GROUP`,
      prefix_id: prefix_id || (groups.length + 1),
      active_headcount: 0,
    };
    groups.push(newGroup);
    this.setStorage('groups', groups);
    return newGroup;
  }

  public static getStudents(): Student[] {
    return this.getStorage<Student[]>('students', INITIAL_STUDENTS);
  }

  public static generateRollNumber(groupId: string): string {
    const groups = this.getGroups();
    const group = groups.find((g) => g.id === groupId);
    const prefix = group ? group.prefix_id : 1;

    const students = this.getStudents();
    const groupStudents = students.filter((s) => s.group_id === groupId);
    const nextSeq = groupStudents.length + 1;

    return `${prefix}-${nextSeq}`;
  }

  public static addStudent(studentData: Omit<Student, 'id' | 'registered_date' | 'status'>): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      ...studentData,
      id: `s-${Date.now()}`,
      roll_no: studentData.roll_number,
      registered_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
      status: 'Active',
    };
    students.unshift(newStudent);
    this.setStorage('students', students);

    // Increment active headcount for group
    const groups = this.getGroups();
    const gIndex = groups.findIndex((g) => g.id === studentData.group_id);
    if (gIndex !== -1) {
      groups[gIndex].active_headcount += 1;
      this.setStorage('groups', groups);
    }

    return newStudent;
  }

  public static toggleStudentStatus(studentId: string): void {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === studentId);
    if (index !== -1) {
      students[index].status = students[index].status === 'Active' ? 'Inactive' : 'Active';
      this.setStorage('students', students);
    }
  }

  public static deleteStudent(studentId: string): void {
    let students = this.getStudents();
    students = students.filter((s) => s.id !== studentId);
    this.setStorage('students', students);
  }

  public static getFeeRecords(): FeeRecord[] {
    return this.getStorage<FeeRecord[]>('fee_records', INITIAL_FEE_RECORDS);
  }

  public static recordPayment(data: {
    student_id: string;
    fee_period: string;
    year: number;
    amount: number;
    status: 'PAID' | 'PENDING';
    payment_mode?: 'UPI' | 'CASH' | 'BANK';
  }): FeeRecord {
    const records = this.getFeeRecords();
    const existingIndex = records.findIndex(
      (r) => r.student_id === data.student_id && r.fee_period === data.fee_period && r.year === data.year
    );

    if (existingIndex !== -1) {
      records[existingIndex] = {
        ...records[existingIndex],
        status: data.status,
        amount: data.amount,
        payment_mode: data.payment_mode,
        payment_date: new Date().toISOString().split('T')[0],
      };
      this.setStorage('fee_records', records);
      return records[existingIndex];
    } else {
      const newRecord: FeeRecord = {
        id: `f-${Date.now()}`,
        student_id: data.student_id,
        year: data.year,
        fee_period: data.fee_period,
        month: data.fee_period,
        status: data.status,
        amount: data.amount,
        payment_mode: data.payment_mode,
        payment_date: new Date().toISOString().split('T')[0],
      };
      records.push(newRecord);
      this.setStorage('fee_records', records);
      return newRecord;
    }
  }

  public static getPaymentModes(): PaymentModeSetting[] {
    return this.getStorage<PaymentModeSetting[]>('payment_modes', INITIAL_PAYMENT_MODES);
  }

  public static togglePaymentMode(id: string): void {
    const modes = this.getPaymentModes();
    const index = modes.findIndex((m) => m.id === id);
    if (index !== -1) {
      modes[index].enabled = !modes[index].enabled;
      this.setStorage('payment_modes', modes);
    }
  }

  public static getDashboardKPIs(): DashboardKPIs {
    const students = this.getStudents();
    const feeRecords = this.getFeeRecords();

    const activeCount = students.filter((s) => s.status === 'Active').length;
    const pendingRecords = feeRecords.filter((r) => r.status === 'PENDING');
    const pendingSum = pendingRecords.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalActiveStudents: activeCount,
      pendingFeesAmount: pendingSum || 1250,
      pendingStudentsCount: pendingRecords.length || 15,
      monthlyAdmissionsCount: 18,
      monthlyAdmissionsTarget: 25,
      recentAdmissions: students.slice(0, 5),
      revenueForecast: [
        { month: 'Jan', amount: 2400 },
        { month: 'Feb', amount: 3100 },
        { month: 'Mar', amount: 2800 },
        { month: 'Apr', amount: 4200 },
        { month: 'May', amount: 3500 },
        { month: 'Jun', amount: 3900 },
      ],
    };
  }

  public static exportLedgerCSV(): void {
    const students = this.getStudents();
    const feeRecords = this.getFeeRecords();

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Roll Number,Student Name,Group,Period,Year,Amount,Status,Payment Mode,Date\n';

    feeRecords.forEach((r) => {
      const s = students.find((st) => st.id === r.student_id);
      const studentName = s ? s.name : 'Unknown';
      const roll = s ? s.roll_number : '—';
      const group = s ? s.group_name : '—';
      csvContent += `"${roll}","${studentName}","${group}","${r.fee_period}",${r.year},${r.amount},"${r.status}","${r.payment_mode || 'N/A'}","${r.payment_date || 'N/A'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Aakritee_Art_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public static backupSQLSchema(): void {
    this.exportDatabaseSQL();
  }

  public static exportDatabaseSQL(): void {
    const students = this.getStudents();
    const feeRecords = this.getFeeRecords();

    let sqlContent = '-- Aakritee Art School - SQL Data Dump\n\n';

    students.forEach((s) => {
      sqlContent += `INSERT INTO students (id, roll_number, name, guardian_name, dob, phone, registered_date, status) VALUES ('${s.id}', '${s.roll_number}', '${s.name.replace(/'/g, "''")}', '${s.guardian_name.replace(/'/g, "''")}', '${s.dob}', '${s.phone}', '${s.registered_date}', '${s.status}');\n`;
    });

    feeRecords.forEach((f) => {
      sqlContent += `INSERT INTO fee_ledger (id, student_id, year, fee_period, amount, status, payment_mode) VALUES ('${f.id}', '${f.student_id}', ${f.year}, '${f.fee_period}', ${f.amount}, '${f.status}', '${f.payment_mode || 'UPI'}');\n`;
    });

    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aakritee_ledger_backup_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
