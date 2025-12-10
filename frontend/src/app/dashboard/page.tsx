'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';

interface Booking {
  id: string;
  customer: {
    id: string;
    name: string;
    fullName?: string;
    phone?: string;
    city?: string;
  };
  service: {
    category: string;
    name: string;
    price?: string;
  };
  date: string;
  time: string;
  address: string;
  description?: string;
  status: string;
  urgency?: string;
  createdAt: string;
}

interface ArtisanProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  bio?: string;
  experience: number;
  services: { category: string; name: string; price?: string }[];
  rating: number;
  totalReviews: number;
  completedJobs: number;
  isAvailable: boolean;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-100' },
  confirmed: { label: 'Confirmé', color: 'text-blue-600', bg: 'bg-blue-100' },
  in_progress: { label: 'En cours', color: 'text-purple-600', bg: 'bg-purple-100' },
  completed: { label: 'Terminé', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  cancelled: { label: 'Annulé', color: 'text-red-600', bg: 'bg-red-100' },
};

const categoryLabels: Record<string, string> = {
  plumbing: 'Plomberie',
  electrical: 'Électricité',
  carpentry: 'Menuiserie',
  painting: 'Peinture',
  hvac: 'Climatisation',
  cleaning: 'Nettoyage',
  gardening: 'Jardinage',
  masonry: 'Maçonnerie',
  locksmith: 'Serrurerie',
  appliance: 'Électroménager',
  moving: 'Déménagement',
  other: 'Autre',
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'profile' | 'reviews'>('overview');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ArtisanProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    bio: '',
    experience: 0,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Booking['customer'] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Fetch user profile
        const profileRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!profileRes.ok) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        const profileData = await profileRes.json();

        // Check if user is artisan
        if (profileData.user.role !== 'artisan') {
          router.push('/');
          return;
        }

        setProfile({
          id: profileData.user.id,
          fullName: profileData.user.fullName,
          email: profileData.user.email,
          phone: profileData.user.phone,
          city: profileData.user.city,
          bio: profileData.artisan?.bio,
          experience: profileData.artisan?.experience || 0,
          services: profileData.artisan?.services || [],
          rating: profileData.artisan?.rating || 0,
          totalReviews: profileData.artisan?.totalReviews || 0,
          completedJobs: profileData.artisan?.completedJobs || 0,
          isAvailable: profileData.artisan?.isAvailable ?? true,
        });

        // Fetch bookings
        const bookingsRes = await fetch('/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.bookings || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleBookingAction = async (bookingId: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setActionLoading(bookingId);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local bookings state
        setBookings(prev => prev.map(b =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        ));

        // If completed, increment local completedJobs counter
        if (newStatus === 'completed') {
          setProfile(prev => prev ? { ...prev, completedJobs: (prev.completedJobs || 0) + 1 } : null);
        }
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAvailability = async () => {
    const token = localStorage.getItem('token');
    if (!token || !profile) return;

    try {
      const response = await fetch('/api/artisans/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: !profile.isAvailable }),
      });

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, isAvailable: !prev.isAvailable } : null);
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const handleStartEdit = () => {
    if (profile) {
      setEditForm({
        fullName: profile.fullName,
        phone: profile.phone,
        city: profile.city,
        bio: profile.bio || '',
        experience: profile.experience,
      });
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setSavingProfile(true);
    try {
      const response = await fetch('/api/artisans/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(prev => prev ? {
          ...prev,
          fullName: data.user.fullName,
          phone: data.user.phone,
          city: data.user.city,
          bio: data.artisan?.bio || '',
          experience: data.artisan?.experience || 0,
        } : null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  // Calculate stats
  const thisMonthBookings = bookings.filter(b => {
    const bookingDate = new Date(b.createdAt);
    const now = new Date();
    return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
  });

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const stats = [
    { label: 'Réservations ce mois', value: thisMonthBookings.length.toString(), icon: '📅' },
    { label: 'En attente', value: pendingBookings.length.toString(), icon: '⏳' },
    { label: 'Note moyenne', value: (profile?.rating || 0).toFixed(1), icon: '⭐' },
    { label: 'Travaux terminés', value: (profile?.completedJobs || 0).toString(), icon: '✅' },
  ];

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-emerald-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Bienvenue, {profile?.fullName}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleAvailability}
                className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors ${
                  profile?.isAvailable
                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  profile?.isAvailable ? 'bg-emerald-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium">
                  {profile?.isAvailable ? 'Disponible' : 'Indisponible'}
                </span>
              </button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Accueil
                </Button>
              </Link>
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
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings & Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Bookings */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Réservations récentes</h2>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Voir tout
                    </button>
                  </div>
                  {bookings.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-4">📭</div>
                      <p className="text-gray-500">Aucune réservation pour le moment</p>
                      <p className="text-sm text-gray-400 mt-1">Les nouvelles demandes apparaîtront ici</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {bookings.slice(0, 4).map((booking) => {
                        const status = statusConfig[booking.status] || statusConfig.pending;
                        return (
                          <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {(booking.customer?.name || booking.customer?.fullName)?.charAt(0) || 'C'}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{booking.customer?.name || booking.customer?.fullName || 'Client'}</p>
                                <p className="text-sm text-gray-500">
                                  {categoryLabels[booking.service?.category] || booking.service?.name}
                                </p>
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
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="font-semibold text-gray-900 mb-4">Actions rapides</h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Mon profil</p>
                        <p className="text-sm text-gray-500">Voir mes informations</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Réservations</p>
                        <p className="text-sm text-gray-500">Gérer les demandes</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Services Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                  <h3 className="font-semibold mb-2">Mes services</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {profile?.services?.slice(0, 3).map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        {categoryLabels[service.category] || service.name}
                      </span>
                    ))}
                    {(profile?.services?.length || 0) > 3 && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        +{(profile?.services?.length || 0) - 3}
                      </span>
                    )}
                  </div>
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
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>
            </div>
            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-500 text-lg">Aucune réservation</p>
                <p className="text-sm text-gray-400 mt-1">
                  {statusFilter !== 'all' ? 'Essayez un autre filtre' : 'Les nouvelles demandes apparaîtront ici'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => {
                  const status = statusConfig[booking.status] || statusConfig.pending;
                  return (
                    <div key={booking.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-lg">
                              {(booking.customer?.name || booking.customer?.fullName)?.charAt(0) || 'C'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{booking.customer?.name || booking.customer?.fullName || 'Client'}</p>
                            <p className="text-sm text-gray-500">
                              {categoryLabels[booking.service?.category] || booking.service?.name}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {booking.time}
                              </span>
                            </div>
                            {booking.address && (
                              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {booking.address}
                              </p>
                            )}
                            {booking.description && (
                              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">
                                {booking.description}
                              </p>
                            )}
                            {booking.customer && (
                              <div className="flex items-center gap-3 mt-2">
                                <button
                                  onClick={() => setSelectedClient(booking.customer)}
                                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  Voir le profil
                                </button>
                                {booking.customer.phone && (
                                  <a
                                    href={`tel:${booking.customer.phone}`}
                                    className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {booking.customer.phone}
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                          {booking.urgency === 'urgent' && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600">
                              Urgent
                            </span>
                          )}
                          {booking.status === 'pending' && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={actionLoading === booking.id}
                                onClick={() => handleBookingAction(booking.id, 'confirmed')}
                              >
                                {actionLoading === booking.id ? '...' : 'Accepter'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                disabled={actionLoading === booking.id}
                                onClick={() => handleBookingAction(booking.id, 'cancelled')}
                              >
                                Refuser
                              </Button>
                            </div>
                          )}
                          {booking.status === 'confirmed' && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={actionLoading === booking.id}
                                onClick={() => handleBookingAction(booking.id, 'in_progress')}
                              >
                                {actionLoading === booking.id ? '...' : 'Commencer'}
                              </Button>
                            </div>
                          )}
                          {booking.status === 'in_progress' && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={actionLoading === booking.id}
                                onClick={() => handleBookingAction(booking.id, 'completed')}
                              >
                                {actionLoading === booking.id ? '...' : 'Terminer'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Mon profil</h2>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleStartEdit}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={savingProfile}>
                    Annuler
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSaveProfile} disabled={savingProfile}>
                    {savingProfile ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              {isEditing ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <select
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    >
                      <option value="casablanca">Casablanca</option>
                      <option value="rabat">Rabat</option>
                      <option value="marrakech">Marrakech</option>
                      <option value="fes">Fès</option>
                      <option value="tangier">Tanger</option>
                      <option value="agadir">Agadir</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none"
                      placeholder="Décrivez vos services et votre expérience..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expérience (années)</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.experience}
                      onChange={(e) => setEditForm({ ...editForm, experience: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Nom complet</label>
                      <p className="text-gray-900">{profile?.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-gray-900">{profile?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                      <p className="text-gray-900">{profile?.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Ville</label>
                      <p className="text-gray-900 capitalize">{profile?.city}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile?.bio && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                      <p className="text-gray-900">{profile.bio}</p>
                    </div>
                  )}

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Expérience</label>
                    <p className="text-gray-900">{profile?.experience} ans</p>
                  </div>
                </>
              )}

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Services</label>
                <div className="flex flex-wrap gap-2">
                  {profile?.services?.map((service, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm"
                    >
                      {categoryLabels[service.category] || service.name}
                      {service.price && <span className="text-gray-500 ml-2">({service.price})</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">{profile?.rating?.toFixed(1)}</p>
                  <p className="text-sm text-gray-500">Note moyenne</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">{profile?.totalReviews}</p>
                  <p className="text-sm text-gray-500">Avis</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">{profile?.completedJobs}</p>
                  <p className="text-sm text-gray-500">Travaux terminés</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-6">Mes avis</h2>

            {profile?.totalReviews === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">⭐</div>
                <p className="text-gray-500">Aucun avis pour le moment</p>
                <p className="text-sm text-gray-400 mt-1">Les avis des clients apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-6 bg-emerald-50 rounded-xl">
                  <p className="text-4xl font-bold text-emerald-600">{profile?.rating?.toFixed(1)}</p>
                  <div className="flex justify-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${star <= (profile?.rating || 0) ? 'text-amber-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Basé sur {profile?.totalReviews} avis</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Client Profile Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedClient(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Profil du client</h3>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Client Info */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">
                  {(selectedClient.name || selectedClient.fullName)?.charAt(0) || 'C'}
                </span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900">
                {selectedClient.name || selectedClient.fullName || 'Client'}
              </h4>
              {selectedClient.city && (
                <p className="text-gray-500 capitalize">{selectedClient.city}</p>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              {selectedClient.phone && (
                <a
                  href={`tel:${selectedClient.phone}`}
                  className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium text-gray-900">{selectedClient.phone}</p>
                  </div>
                </a>
              )}

              {selectedClient.phone && (
                <a
                  href={`https://wa.me/${selectedClient.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="font-medium text-gray-900">Envoyer un message</p>
                  </div>
                </a>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedClient(null)}
              className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
