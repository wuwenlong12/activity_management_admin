export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
} 