import { CornerDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! Página não encontrada</p>

      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        <CornerDownLeft className="w-5 h-5" />
        Retornar para a Home
      </Link>
    </div>
  );
}
