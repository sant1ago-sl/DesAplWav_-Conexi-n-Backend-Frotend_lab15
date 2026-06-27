import { cookies } from 'next/headers';
import { Product, Category, ApiResponse } from '@/types/product';
import { authHeader } from '@/lib/auth';
import AdminProductManager from './AdminProductManager';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      cache: 'no-store',
      headers: await authHeader(),
    });

    if (!res.ok) return [];

    const data: ApiResponse<Product[]> = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });

    if (!res.ok) return [];

    const data: ApiResponse<Category[]> = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function AdminPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const token = (await cookies()).get('session')?.value ?? null;

  return (
    <AdminProductManager
      initialProducts={products}
      categories={categories}
      token={token}
    />
  );
}
