import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';

const PAYPAL_API_URL =
  PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// POST - Create PayPal order
export async function POST(request: NextRequest) {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'PayPal non configure' },
        { status: 500 }
      );
    }

    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    await connectDB();

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId requis' }, { status: 400 });
    }

    // Get booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Reservation non trouvee' }, { status: 404 });
    }

    // Calculate amount in USD (PayPal requires USD for Morocco)
    const priceMAD = parseFloat(booking.service.price.replace(/[^\d.]/g, '')) || 0;
    // Approximate MAD to USD conversion (1 USD ≈ 10 MAD)
    const amountUSD = (priceMAD / 10).toFixed(2);

    // Create or get pending payment
    let payment = await Payment.findOne({
      booking: bookingId,
      status: 'pending',
      method: 'paypal',
    });

    if (!payment) {
      payment = await Payment.create({
        booking: bookingId,
        customer: booking.customer,
        artisan: booking.artisan,
        amount: priceMAD,
        currency: 'MAD',
        method: 'paypal',
        status: 'pending',
      });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: payment._id.toString(),
            description: `Service: ${booking.service.name}`,
            amount: {
              currency_code: 'USD',
              value: amountUSD,
            },
            custom_id: bookingId,
          },
        ],
        application_context: {
          brand_name: 'Fi-Khidmatik',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancel`,
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error('PayPal order error:', orderData);
      return NextResponse.json(
        { error: 'Erreur creation commande PayPal' },
        { status: 500 }
      );
    }

    // Update payment with PayPal order ID
    await Payment.findByIdAndUpdate(payment._id, {
      paypalOrderId: orderData.id,
    });

    return NextResponse.json({
      orderId: orderData.id,
      paymentId: payment._id,
    });
  } catch (error: any) {
    console.error('PayPal create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
