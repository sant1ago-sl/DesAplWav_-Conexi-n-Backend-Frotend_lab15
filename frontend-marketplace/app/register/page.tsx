import Link from 'next/link';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Crear cuenta</h1>
        <RegisterForm />
        <p className="mt-6 text-sm text-gray-600 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-gray-900 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
