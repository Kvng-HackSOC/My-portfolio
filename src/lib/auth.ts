import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@/types';
import { NextRequest } from 'next/server';
import { config } from '@/lib/config';

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email },
    config.auth.jwtSecret,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.auth.jwtSecret);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const getTokenFromRequest = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

export const authenticateRequest = (request: NextRequest): any => {
  const token = getTokenFromRequest(request);
  if (!token) {
    throw new Error('No token provided');
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error('Invalid token');
  }
  
  return decoded;
};