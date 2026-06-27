'use client';

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="text-gray-600 hover:text-gray-900 transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
