export interface Role {
  id: number;
  name: 'CUSTOMER' | 'ADMIN';
}

export interface Category {
  id: number;
  nombre: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  categoryId?: number | null;
  imageUrl?: string | null;
  category?: Category | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface AuthResponseData {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
