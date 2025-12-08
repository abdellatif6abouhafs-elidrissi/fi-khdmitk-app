'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

// Mock bookings data
const mockBookings = [
  {
    id: 1,
    artisan: { id: 1, name: 'Ahmed Ben Ali', city: 'Casablanca' },
    service: 'Plomberie',
    status: 'confirmed',
    date: '2024-01-20',
    time: '10:00',
    address: '123 Rue Example, Casablanca',
    price: '250 MAD',
  },
  {
    id: 2,
    artisan: { id: 2, name: 'Fatima Zahra', city: 'Rabat' },
    service: 'Électricité',
    status: 'pending',
    date: '2024-01-22',
    time: '14:00',
    address: '456 Avenue Test, Rabat',
    price: '300 MAD',
  },
  {
    id: 3,
    artisan: { id: 3, name: 'Youssef El Amrani', city: 'Marrakech' },
    service: 'Menuiserie',
    status: 'completed',
    date: '2024-01-15',
    time: '09:00',
    address: '789 Boulevard Demo, Marrakech',
    price: '400 MAD',
  },
  {
    id: 4,
    artisan: { id: 4, name: 'Khadija Bennani', city: 'Fès' },
    service: 'Nettoyage',
    status: 'cancelled',
    date: '2024-01-18',
    time: '11:00',
    address: '321 Place Sample, Fès',
    price: '200 MAD',
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-100' },
  confirmed: { label: 'Confirmé', color: 'text-blue-600', bg: 'bg-blue-100' },
  in_progress: { label: 'En cours', color: 'text-purple-600', bg: 'bg-purple-100' },
  completed: { label: 'Terminé', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  cancelled: { label: 'Annulé', color: 'text-red-600', bg: 'bg-red-100' },
};

export default function BookingsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  const filteredBookings = filter === 'all'
    ? mockBookings
    : mockBookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('bookings')}</h1>
          <p className="text-gray-600 mt-1">Gérez vos réservations et suivez leur statut</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'Tous' },
            { value: 'pending', label: 'En attente' },
            { value: 'confirmed', label: 'Confirmés' },
            { value: 'completed', label: 'Terminés' },
            { value: 'cancelled', label: 'Annulés' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.value
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore de réservations</p>
            <Link href="/artisans">
              <Button variant="primary">Trouver un artisan</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const status = statusConfig[booking.status];
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left Side */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {booking.artisan.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.artisan.name}</h3>
                        <p className="text-sm text-gray-500">{booking.service}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {booking.date} à {booking.time}
                        </div>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="font-semibold text-gray-900">{booking.price}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {booking.address}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-3">
                    <Link href={`/artisans/${booking.artisan.id}`}>
                      <Button variant="outline" size="sm">Voir le profil</Button>
                    </Link>
                    {booking.status === 'pending' && (
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        Annuler
                      </Button>
                    )}
                    {booking.status === 'completed' && (
                      <Button variant="primary" size="sm">Laisser un avis</Button>
                    )}
                    {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                      <Button variant="primary" size="sm">Contacter</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
