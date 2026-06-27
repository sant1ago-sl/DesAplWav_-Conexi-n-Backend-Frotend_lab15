import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface SessionPayload {
  id: number;
  role: 'CUSTOMER' | 'ADMIN';
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get('session')?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as SessionPayload;
  } catch {
    return null;
  }
}

export async function authHeader(): Promise<Record<string, string>> {
  const token = (await cookies()).get('session')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
