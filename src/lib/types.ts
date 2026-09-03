export type StudentStatus = 'Active' | 'Inactive';
export type PaymentStatus = 'PAID' | 'PENDING' | 'UNPAID';

export interface ArtGroup {
  id: string;
  name: string;
  code: string;
  prefix_id: number;
  active_headcount: number;
}

export interface Student {
  id: string;
  group_id: string;
  group_name: string;
  roll_number: string;
  roll_no?: string;
  name: string;
  guardian_name: string;
  dob: string;
  phone: string;
  gender: string;
  registered_date: string;
  status: StudentStatus;
}

export type FeePeriod = 
  | 'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' 
  | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC' 
  | 'EXAM_1' | 'EXAM_2';

export interface FeeRecord {
  id: string;
  student_id: string;
  year: number;
  fee_period: string;
  month?: string;
  status: PaymentStatus;
  amount: number;
  payment_mode?: 'UPI' | 'CASH' | 'BANK';
  payment_date?: string;
}

export interface PaymentModeSetting {
  id: string;
  name: string;
  enabled: boolean;
}

export interface RevenueForecast {
  month: string;
  amount: number;
}

export interface DashboardKPIs {
  totalActiveStudents: number;
  pendingFeesAmount: number;
  pendingStudentsCount: number;
  monthlyAdmissionsCount: number;
  monthlyAdmissionsTarget: number;
  recentAdmissions: Student[];
  revenueForecast: RevenueForecast[];
}
