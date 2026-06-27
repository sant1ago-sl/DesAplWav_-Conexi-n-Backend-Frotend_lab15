import Link from 'next/link';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Iniciar sesión</h1>
        <LoginForm />
        <p className="mt-6 text-sm text-gray-600 text-center">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-gray-900 font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
