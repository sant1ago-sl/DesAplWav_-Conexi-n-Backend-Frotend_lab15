import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            ProductStore
          </Link>
          <div className="flex gap-6 items-center">
            {session ? (
              <>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Productos
                </Link>
                {session.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Admin
                  </Link>
                )}
                <span className="text-xs uppercase tracking-wide text-gray-400 border border-gray-200 rounded-full px-2 py-1">
                  {session.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Iniciar sesión
                </Link>
                <Link href="/register" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
