// src/lib/types.ts

// Authentication Credentials
export interface LoginCredentials {
  email: string;
  password?: string; // Optional for providers like Google/GitHub
}

export interface RegisterCredentials extends LoginCredentials {
  passwordConfirm: string; // Made required for validation
  role: 'customer' | 'admin'; // Made required for validation
  name: string; // Full name of the user
  phone: string; // Contact phone number
  address: string; // Address of the user
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  category_id?: number | null;
  created_at?: string | Date | null;
}

// Add other shared types here as needed
