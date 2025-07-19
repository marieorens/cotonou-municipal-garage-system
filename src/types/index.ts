// Types for Municipal Pound Management System

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'agent' | 'finance';

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Vehicle {
  id: string;
  license_plate: string;
  make: string;
  model: string;
  color: string;
  year: number;
  type: VehicleType;
  status: VehicleStatus;
  impound_date: string;
  location: string;
  photos: string[];
  qr_code?: string;
  owner_id?: string;
  estimated_value: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type VehicleType = 'car' | 'motorcycle' | 'truck' | 'other';
export type VehicleStatus = 'impounded' | 'claimed' | 'sold' | 'destroyed' | 'pending_destruction';

export interface Owner {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  address: string;
  id_number: string;
  id_type: 'cni' | 'passport' | 'driver_license';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  vehicle_id: string;
  owner_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  reference: string;
  description: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money';

export interface Procedure {
  id: string;
  vehicle_id: string;
  type: ProcedureType;
  status: ProcedureStatus;
  documents: Document[];
  fees_calculated: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type ProcedureType = 'release' | 'sale' | 'destruction';
export type ProcedureStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploaded_at: string;
}

export interface Notification {
  id: string;
  recipient: string;
  type: NotificationType;
  channel: NotificationChannel;
  message: string;
  sent_at: string;
  status: NotificationStatus;
}

export type NotificationType = 'impound_notice' | 'deadline_warning' | 'payment_reminder';
export type NotificationChannel = 'sms' | 'email';
export type NotificationStatus = 'pending' | 'sent' | 'failed';

export interface DashboardStats {
  total_vehicles: number;
  vehicles_by_status: Record<VehicleStatus, number>;
  monthly_revenue: number;
  recent_payments: Payment[];
  pending_procedures: number;
}

export interface Settings {
  fees: FeeStructure;
  legal_deadlines: LegalDeadlines;
  notification_templates: NotificationTemplates;
}

export interface FeeStructure {
  daily_storage: number;
  release_fee: number;
  administrative_fee: number;
  towing_fee: number;
}

export interface LegalDeadlines {
  notice_period: number; // days
  destruction_deadline: number; // days
}

export interface NotificationTemplates {
  impound_sms: string;
  impound_email: string;
  deadline_sms: string;
  deadline_email: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export interface SearchFilters {
  search?: string;
  status?: VehicleStatus;
  date_from?: string;
  date_to?: string;
  vehicle_type?: VehicleType;
  page?: number;
  limit?: number;
}