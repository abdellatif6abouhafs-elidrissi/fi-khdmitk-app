'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';

interface PayPalCheckoutProps {
  bookingId: string;
  amount: number;
  serviceName: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
}

export function PayPalCheckout({
  bookingId,
  amount,
  serviceName,
  onSuccess,
  onError,
  onCancel,
}: PayPalCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="p-4 bg-red-500/20 rounded-lg text-red-400 text-center">
        PayPal non configure
      </div>
    );
  }

  const createOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur creation commande');
      }

      setLoading(false);
      return data.orderId;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const onApprove = async (data: any) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: data.orderID }),
      });

      const captureData = await response.json();

      if (!response.ok) {
        throw new Error(captureData.error || 'Erreur capture paiement');
      }

      setLoading(false);
      onSuccess(captureData);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      onError(err);
    }
  };

  // Convert MAD to USD for display (approximate)
  const amountUSD = (amount / 10).toFixed(2);

  return (
    <div className="w-full">
      <div className="bg-gray-800 rounded-xl p-6 mb-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Paiement pour: {serviceName}
        </h3>
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-400">Montant:</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-emerald-400">{amount} MAD</span>
            <p className="text-xs text-gray-500">≈ ${amountUSD} USD</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          </div>
        )}

        <PayPalScriptProvider
          options={{
            clientId,
            currency: 'USD',
            intent: 'capture',
          }}
        >
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'pay',
            }}
            disabled={loading}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(err) => {
              console.error('PayPal error:', err);
              setError('Erreur PayPal');
              onError(err);
            }}
            onCancel={() => {
              setError('Paiement annule');
              onCancel();
            }}
          />
        </PayPalScriptProvider>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Paiement securise par PayPal</p>
        <p className="mt-1">Vous pouvez payer avec carte bancaire via PayPal</p>
      </div>
    </div>
  );
}
