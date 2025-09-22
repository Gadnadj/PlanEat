import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-tres-securise';
const JWT_EXPIRES_IN = '7d';

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

// Hacher un mot de passe
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Vérifier un mot de passe
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Générer un token JWT
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Vérifier et décoder un token JWT
export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

// Valider un email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Valider un mot de passe
export const isValidPassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 6 caractères' };
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'Le mot de passe ne peut pas dépasser 128 caractères' };
  }
  
  return { valid: true, message: '' };
};

// Valider un nom
export const isValidName = (name: string): { valid: boolean; message: string } => {
  if (name.trim().length < 2) {
    return { valid: false, message: 'Le nom doit contenir au moins 2 caractères' };
  }
  
  if (name.trim().length > 50) {
    return { valid: false, message: 'Le nom ne peut pas dépasser 50 caractères' };
  }
  
  return { valid: true, message: '' };
};
