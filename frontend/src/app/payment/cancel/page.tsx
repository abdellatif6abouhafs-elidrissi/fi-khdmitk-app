'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Paiement annule
          </h1>
          <p className="text-gray-400 mb-6">
            Votre paiement a ete annule. Aucun montant n&apos;a ete debite de votre compte.
          </p>

          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400">
              Vous pouvez reessayer le paiement a tout moment depuis vos reservations.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="block w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
            >
              Reessayer le paiement
            </button>
            <Link
              href="/customer/dashboard/bookings"
              className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
            >
              Voir mes reservations
            </Link>
            <Link
              href="/"
              className="block w-full py-3 px-4 border border-gray-600 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors"
            >
              Retour a l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
