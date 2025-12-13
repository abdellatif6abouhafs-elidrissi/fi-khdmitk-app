import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import { createNotification, notificationMessages } from '@/lib/notifications';
import { sendPushNotification } from '@/lib/push';
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

// POST - Capture PayPal order after approval
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

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId requis' }, { status: 400 });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Capture the order
    const captureResponse = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      console.error('PayPal capture error:', captureData);
      return NextResponse.json(
        { error: 'Erreur capture paiement PayPal' },
        { status: 500 }
      );
    }

    // Find and update payment
    const payment = await Payment.findOne({ paypalOrderId: orderId });

    if (!payment) {
      return NextResponse.json(
        { error: 'Paiement non trouve' },
        { status: 404 }
      );
    }

    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    // Update payment status
    await Payment.findByIdAndUpdate(payment._id, {
      status: 'completed',
      paypalCaptureId: captureId,
      transactionId: captureId,
      paidAt: new Date(),
      metadata: {
        paypalResponse: captureData,
      },
    });

    // Update booking status to confirmed if still pending
    const booking = await Booking.findById(payment.booking)
      .populate('customer', 'name email')
      .populate('artisan', 'userId businessName');

    if (booking && booking.status === 'pending') {
      booking.status = 'confirmed';
      await booking.save();

      // Send notification to artisan about payment received
      const artisanUserId = (booking.artisan as any).userId?.toString();
      if (artisanUserId) {
        await createNotification({
          userId: artisanUserId,
          type: 'system',
          title: 'Paiement recu',
          message: `Paiement de ${payment.amount} MAD recu pour le service ${booking.service.name}`,
          data: { bookingId: booking._id.toString() },
        });

        await sendPushNotification(artisanUserId, {
          title: 'Paiement recu',
          body: `Paiement de ${payment.amount} MAD recu`,
          data: { type: 'payment', bookingId: booking._id.toString() },
        });
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment._id,
        status: 'completed',
        transactionId: captureId,
        amount: payment.amount,
        currency: payment.currency,
      },
      booking: {
        id: booking?._id,
        status: booking?.status,
      },
    });
  } catch (error: any) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
