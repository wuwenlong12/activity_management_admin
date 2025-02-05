import { Role } from '../auth/types';

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  pageSize: number;
}

export interface UserListResponse {
  users: User[];
  pagination: Pagination;
}


export interface User {
  _id: string;
  role: Role;
  username: string;
  email: string;
  imgurl: string;
  createdAt: Date;
  updatedAt: Date;
  school?: string;
  className?: string;
  studentId?: string;
  phone?: string;
  bio?: string;
}

export interface UpdateUserParams {
  email?: string;
  imgurl?: string;
  school?: string;
  className?: string;
  studentId?: string;
  phone?: string;
  bio?: string;
} 