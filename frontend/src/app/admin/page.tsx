'use client';

import { useState, useEffect } from 'react';
import { fetchExportData, exportToExcel, exportToPDF, ExportType } from '@/lib/export';

interface Stats {
  totalUsers: number;
  totalArtisans: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
  newUsersThisMonth: number;
  newArtisansThisMonth: number;
}

interface RecentBooking {
  _id: string;
  customer: { fullName: string };
  artisan: { user: { fullName: string } };
  service: { category?: string; name?: string; price?: number } | string;
  status: string;
  date: string;
  totalPrice: number;
}

interface RecentUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  isVerified: boolean;
}


interface ChartData {
  bookings: { month: string; count: number }[];
  revenue: { month: string; total: number }[];
}
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (type: ExportType, format: 'excel' | 'pdf') => {
    setExporting(`${type}-${format}`);
    try {
      const data = await fetchExportData(type);
      const filename = `fi-khidmatik-${type}-${new Date().toISOString().split('T')[0]}`;
      
      if (format === 'excel') {
        exportToExcel(data, filename);
      } else {
        exportToPDF(data, filename, 'Fi Khidmatik - Rapport');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert("Erreur lors de l'export");
    } finally {
      setExporting(null);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data.stats);
      setRecentBookings(data.recentBookings || []);
      setRecentUsers(data.recentUsers || []);
      setChartData(data.chartData || null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Utilisateurs',
      value: stats?.totalUsers || 0,
      change: `+${stats?.newUsersThisMonth || 0} ce mois`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Artisans',
      value: stats?.totalArtisans || 0,
      change: `+${stats?.newArtisansThisMonth || 0} ce mois`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Réservations',
      value: stats?.totalBookings || 0,
      change: `${stats?.pendingBookings || 0} en attente`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Revenus',
      value: `${(stats?.totalRevenue || 0).toLocaleString()} MAD`,
      change: `${stats?.completedBookings || 0} complétées`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Exporter les données</h3>
            <p className="text-sm text-gray-400">Téléchargez les rapports en Excel ou PDF</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative group">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporter
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Excel (.xlsx)</p>
                  <button
                    onClick={() => handleExport('all', 'excel')}
                    disabled={exporting !== null}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded-lg disabled:opacity-50"
                  >
                    {exporting === 'all-excel' ? 'Export en cours...' : 'Toutes les données'}
                  </button>
                  <button
                    onClick={() => handleExport('users', 'excel')}
                    disabled={exporting !== null}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded-lg disabled:opacity-50"
                  >
                    {exporting === 'users-excel' ? 'Export en cours...' : 'Utilisateurs'}
                  </button>
                  <button
                    onClick={() => handleExport('artisans', 'excel')}
                    disabled={exporting !== null}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded-lg disabled:opacity-50"
                  >
                    {exporting === 'artisans-excel' ? 'Export en cours...' : 'Artisans'}
                  </button>
                  <button
                    onClick={() => handleExport('bookings', 'excel')}
                    disabled={exporting !== null}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded-lg disabled:opacity-50"
                  >
                    {exporting === 'bookings-excel' ? 'Export en cours...' : 'Réservations'}
                  </button>
                  <hr className="my-2 border-gray-600" />
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">PDF</p>
                  <button
                    onClick={() => handleExport('all', 'pdf')}
                    disabled={exporting !== null}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded-lg disabled:opacity-50"
                  >
                    {exporting === 'all-pdf' ? 'Export en cours...' : 'Rapport complet'}
                  </button>
                  <button
                    onClick={() => handleExport('bookings', 'pdf')}
                    disabled={exporting !== null}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded-lg disabled:opacity-50"
                  >
                    {exporting === 'bookings-pdf' ? 'Export en cours...' : 'Réservations'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.change}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <div className={`bg-gradient-to-br ${card.color} bg-clip-text text-transparent`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart - Real Data */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Réservations par mois</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {chartData?.bookings.map((item, index) => {
              const maxCount = Math.max(...(chartData?.bookings.map(b => b.count) || [1]), 1);
              const height = (item.count / maxCount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {item.count} réservations
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-500 hover:from-emerald-500 hover:to-emerald-300"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  ></div>
                  <span className="text-xs text-gray-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Chart - Real Data */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Revenus par mois</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {chartData?.revenue.map((item, index) => {
              const maxTotal = Math.max(...(chartData?.revenue.map(r => r.total) || [1]), 1);
              const height = (item.total / maxTotal) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-700 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {item.total.toLocaleString()} MAD
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg transition-all duration-500 hover:from-amber-500 hover:to-amber-300"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  ></div>
                  <span className="text-xs text-gray-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Réservations récentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-3">
                    Client
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-3">
                    Service
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-white">{booking.customer?.fullName || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-400">
                          {typeof booking.service === 'object' ? booking.service?.name || booking.service?.category || 'Service' : booking.service}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Aucune réservation récente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Nouveaux utilisateurs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-3">
                    Utilisateur
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-3">
                    Rôle
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{user.fullName?.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.fullName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'artisan' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {user.role === 'artisan' ? 'Artisan' : 'Client'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.isVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {user.isVerified ? 'Vérifié' : 'Non vérifié'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Aucun utilisateur récent
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
