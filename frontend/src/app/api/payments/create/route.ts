import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

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

// POST - Create a payment record and get PayPal order details
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    await connectDB();

    const { bookingId, method } = await request.json();

    if (!bookingId || !method) {
      return NextResponse.json(
        { error: 'bookingId et method sont requis' },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await Booking.findById(bookingId)
      .populate('customer', 'name email')
      .populate('artisan', 'userId businessName');

    if (!booking) {
      return NextResponse.json({ error: 'Reservation non trouvee' }, { status: 404 });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      booking: bookingId,
      status: { $in: ['pending', 'completed'] },
    });

    if (existingPayment) {
      if (existingPayment.status === 'completed') {
        return NextResponse.json(
          { error: 'Cette reservation est deja payee' },
          { status: 400 }
        );
      }
      // Return existing pending payment
      return NextResponse.json({
        payment: existingPayment,
        message: 'Paiement en attente existe deja',
      });
    }

    // Calculate amount
    const priceString = booking.service.price;
    const amount = parseFloat(priceString.replace(/[^\d.]/g, '')) || 0;

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      customer: booking.customer._id,
      artisan: booking.artisan._id,
      amount,
      currency: 'MAD',
      method,
      status: 'pending',
    });

    return NextResponse.json({
      payment,
      booking: {
        id: booking._id,
        service: booking.service,
        date: booking.date,
        time: booking.time,
      },
      amount,
      currency: 'MAD',
    });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
