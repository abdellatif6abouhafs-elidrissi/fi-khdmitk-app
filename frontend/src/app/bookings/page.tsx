'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { ReviewModal } from '@/components/ReviewModal';

interface Booking {
  id: string;
  artisan: {
    id: string;
    fullName: string;
    city: string;
    phone?: string;
  };
  artisanId?: string;
  service: {
    category: string;
    name: string;
    price?: string;
  };
  status: string;
  date: string;
  time: string;
  address: string;
  description?: string;
  urgency?: string;
  rating?: number;
  createdAt: string;
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

export default function BookingsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; booking: Booking | null }>({
    isOpen: false,
    booking: null,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const handleCancelBooking = async (bookingId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setActionLoading(bookingId);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setBookings(prev => prev.map(b =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ));
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    const token = localStorage.getItem('token');
    if (!token || !reviewModal.booking) return;

    const booking = reviewModal.booking;
    const artisanId = booking.artisanId || booking.artisan?.id;

    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookingId: booking.id,
        artisanId,
        rating,
        comment,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erreur lors de l\'envoi');
    }

    // Update booking in local state to show it's been reviewed
    setBookings(prev => prev.map(b =>
      b.id === booking.id ? { ...b, rating } : b
    ));
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

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
            { value: 'in_progress', label: 'En cours' },
            { value: 'completed', label: 'Terminés' },
            { value: 'cancelled', label: 'Annulés' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.value
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'Aucune réservation' : 'Aucune réservation trouvée'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all'
                ? "Vous n'avez pas encore de réservations"
                : 'Essayez un autre filtre'}
            </p>
            <Link href="/artisans">
              <Button variant="primary">Trouver un artisan</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left Side */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {booking.artisan?.fullName?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.artisan?.fullName || 'Artisan'}</h3>
                        <p className="text-sm text-emerald-600 font-medium">
                          {categoryLabels[booking.service?.category] || booking.service?.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
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
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                      {booking.urgency === 'urgent' && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600">
                          Urgent
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  {booking.address && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {booking.address}
                    </div>
                  )}

                  {/* Description */}
                  {booking.description && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                      {booking.description}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href={`/artisans/${booking.artisan?.id}`}>
                      <Button variant="outline" size="sm">Voir le profil</Button>
                    </Link>
                    {booking.artisan?.phone && (
                      <a href={`tel:${booking.artisan.phone}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Appeler
                        </Button>
                      </a>
                    )}
                    {booking.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        disabled={actionLoading === booking.id}
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        {actionLoading === booking.id ? 'Annulation...' : 'Annuler'}
                      </Button>
                    )}
                    {booking.status === 'completed' && !booking.rating && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setReviewModal({ isOpen: true, booking })}
                      >
                        Laisser un avis
                      </Button>
                    )}
                    {booking.status === 'completed' && booking.rating && (
                      <span className="flex items-center gap-1 text-sm text-emerald-600">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Avis envoyé ({booking.rating}/5)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, booking: null })}
        onSubmit={handleSubmitReview}
        artisanName={reviewModal.booking?.artisan?.fullName || ''}
        serviceName={categoryLabels[reviewModal.booking?.service?.category || ''] || reviewModal.booking?.service?.name || ''}
      />
    </div>
  );
}
