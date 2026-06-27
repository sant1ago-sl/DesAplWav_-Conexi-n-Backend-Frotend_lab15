import Link from 'next/link';
import { Product, Category, ApiResponse } from '@/types/product';
import { authHeader } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProducts(categoryId?: string, search?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (categoryId) params.set('categoryId', categoryId);
    if (search) params.set('search', search);
    const qs = params.toString();

    const res = await fetch(`${API_URL}/products${qs ? `?${qs}` : ''}`, {
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

function categoryHref(categoryId: string | undefined, search: string | undefined) {
  const params = new URLSearchParams();
  if (categoryId) params.set('categoryId', categoryId);
  if (search) params.set('search', search);
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string; search?: string }>;
}) {
  const { categoryId, search } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(categoryId, search),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Productos</h1>

      <form action="/" method="GET" className="mb-6">
        {categoryId && <input type="hidden" name="categoryId" value={categoryId} />}
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 bg-white"
          />
        </div>
      </form>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={categoryHref(undefined, search)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              !categoryId
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            Todas
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={categoryHref(String(category.id), search)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                categoryId === String(category.id)
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {category.nombre}
            </Link>
          ))}
        </div>
      )}

      {search && (
        <p className="text-sm text-gray-500 mb-4">
          Resultados para &quot;{search}&quot; ({products.length})
        </p>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.nombre}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Sin imagen
                </div>
              )}
              <div className="p-6">
                {product.category && (
                  <span className="inline-block text-xs uppercase tracking-wide text-gray-400 mb-2">
                    {product.category.nombre}
                  </span>
                )}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.nombre}
                </h2>
                <p className="text-2xl font-bold text-gray-900 mb-3">
                  S/ {product.precio}
                </p>
                {product.descripcion && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.descripcion}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
