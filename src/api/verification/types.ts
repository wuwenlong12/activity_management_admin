import { User } from "../auth/type";

export interface Verification {
  _id: string;
  user: User;
  type: 'personal' | 'organization';
  status: 'pending' | 'approved' | 'rejected';
  phone: string;
  email: string;
  realName: string;
  studentId: string;
  studentCardImage: string;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VerificationListResult {
  list: Verification[];
  total: number;
  page: number;
  limit: number;
} 