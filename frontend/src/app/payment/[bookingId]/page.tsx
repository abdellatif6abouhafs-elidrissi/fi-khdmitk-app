'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { PayPalCheckout } from '@/components/PayPalCheckout';

interface BookingDetails {
  _id: string;
  service: {
    category: string;
    name: string;
    price: string;
  };
  date: string;
  time: string;
  status: string;
  artisan: {
    businessName: string;
  };
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'cash'>('paypal');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Reservation non trouvee');
      }

      const data = await response.json();
      setBooking(data.booking);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (details: any) => {
    router.push('/payment/success');
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
  };

  const handleCashPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          method: 'cash',
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur enregistrement paiement');
      }

      router.push('/customer/dashboard/bookings');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Reservation non trouvee'}</p>
          <Link
            href="/customer/dashboard/bookings"
            className="text-emerald-400 hover:text-emerald-300"
          >
            Retour aux reservations
          </Link>
        </div>
      </div>
    );
  }

  const amount = parseFloat(booking.service.price.replace(/[^\d.]/g, '')) || 0;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/customer/dashboard/bookings"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </Link>

        <h1 className="text-2xl font-bold text-white mb-6">Paiement</h1>

        {/* Booking Summary */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Resume de la reservation</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Service:</span>
              <span className="text-white">{booking.service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Artisan:</span>
              <span className="text-white">{booking.artisan?.businessName || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date:</span>
              <span className="text-white">
                {new Date(booking.date).toLocaleDateString('fr-FR')} a {booking.time}
              </span>
            </div>
            <div className="border-t border-gray-700 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total:</span>
                <span className="text-2xl font-bold text-emerald-400">{amount} MAD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Mode de paiement</h2>
          <div className="space-y-3">
            <label
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${
                paymentMethod === 'paypal'
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
                className="sr-only"
              />
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082h-2.19c-1.717 0-3.146 1.27-3.403 2.975l-1.234 7.818a.641.641 0 0 0 .633.74h4.606c.524 0 .968-.382 1.05-.901l.873-5.532c.082-.519.526-.901 1.05-.901h2.19c4.298 0 7.664-1.747 8.647-6.797.462-2.373.109-4.207-1.016-5.197z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">PayPal</p>
                  <p className="text-sm text-gray-400">Carte bancaire ou compte PayPal</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  paymentMethod === 'paypal'
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-gray-600'
                }`}
              >
                {paymentMethod === 'paypal' && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </label>

            <label
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${
                paymentMethod === 'cash'
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="sr-only"
              />
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Especes</p>
                  <p className="text-sm text-gray-400">Payer a la fin du service</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-gray-600'
                }`}
              >
                {paymentMethod === 'cash' && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Payment Action */}
        {paymentMethod === 'paypal' ? (
          <PayPalCheckout
            bookingId={bookingId}
            amount={amount}
            serviceName={booking.service.name}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="bg-yellow-500/20 rounded-lg p-4 mb-4">
              <p className="text-yellow-400 text-sm">
                En choisissant le paiement en especes, vous vous engagez a payer l&apos;artisan a la fin du service.
              </p>
            </div>
            <button
              onClick={handleCashPayment}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
            >
              Confirmer le paiement en especes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
