'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';

// Mock data for artisan dashboard
const stats = [
  { label: 'Réservations ce mois', value: '24', change: '+12%', icon: '📅' },
  { label: 'Revenus ce mois', value: '4,800 MAD', change: '+8%', icon: '💰' },
  { label: 'Note moyenne', value: '4.9', change: '+0.1', icon: '⭐' },
  { label: 'Nouveaux avis', value: '12', change: '+3', icon: '💬' },
];

const recentBookings = [
  { id: 1, customer: 'Sara M.', service: 'Plomberie', date: '2024-01-20', time: '10:00', status: 'pending' },
  { id: 2, customer: 'Karim L.', service: 'Climatisation', date: '2024-01-20', time: '14:00', status: 'confirmed' },
  { id: 3, customer: 'Nadia B.', service: 'Plomberie', date: '2024-01-21', time: '09:00', status: 'pending' },
  { id: 4, customer: 'Omar S.', service: 'Plomberie', date: '2024-01-22', time: '11:00', status: 'confirmed' },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-100' },
  confirmed: { label: 'Confirmé', color: 'text-blue-600', bg: 'bg-blue-100' },
  in_progress: { label: 'En cours', color: 'text-purple-600', bg: 'bg-purple-100' },
  completed: { label: 'Terminé', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  cancelled: { label: 'Annulé', color: 'text-red-600', bg: 'bg-red-100' },
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'profile' | 'reviews'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Bienvenue, Ahmed Ben Ali</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium">Disponible</span>
              </div>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 max-w-md">
          {[
            { id: 'overview', label: 'Aperçu' },
            { id: 'bookings', label: 'Réservations' },
            { id: 'profile', label: 'Profil' },
            { id: 'reviews', label: 'Avis' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{stat.icon}</span>
                    <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings & Calendar */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Bookings */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Réservations récentes</h2>
                    <button className="text-sm text-emerald-600 hover:text-emerald-700">
                      Voir tout
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {recentBookings.map((booking) => {
                      const status = statusConfig[booking.status];
                      return (
                        <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">{booking.customer.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{booking.customer}</p>
                              <p className="text-sm text-gray-500">{booking.service}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-900">{booking.date}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="font-semibold text-gray-900 mb-4">Actions rapides</h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ajouter un service</p>
                        <p className="text-sm text-gray-500">Proposez de nouveaux services</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Gérer le portfolio</p>
                        <p className="text-sm text-gray-500">Ajoutez des photos de vos travaux</p>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Horaires</p>
                        <p className="text-sm text-gray-500">Définissez vos disponibilités</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Notification */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                  <h3 className="font-semibold mb-2">Complétez votre profil</h3>
                  <p className="text-emerald-100 text-sm mb-4">
                    Ajoutez plus d'informations pour augmenter votre visibilité
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div className="bg-white rounded-full h-2 w-3/4"></div>
                  </div>
                  <p className="text-sm text-emerald-100">75% complété</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Toutes les réservations</h2>
                <div className="flex gap-2">
                  <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm">
                    <option>Tous les statuts</option>
                    <option>En attente</option>
                    <option>Confirmé</option>
                    <option>Terminé</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {recentBookings.map((booking) => {
                const status = statusConfig[booking.status];
                return (
                  <div key={booking.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-lg">{booking.customer.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{booking.customer}</p>
                        <p className="text-sm text-gray-500">{booking.service} - {booking.date} à {booking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button variant="primary" size="sm">Accepter</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Refuser</Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-6">Modifier mon profil</h2>
            <p className="text-gray-500">Les paramètres du profil seront bientôt disponibles...</p>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-6">Mes avis</h2>
            <p className="text-gray-500">La gestion des avis sera bientôt disponible...</p>
          </div>
        )}
      </div>
    </div>
  );
}
