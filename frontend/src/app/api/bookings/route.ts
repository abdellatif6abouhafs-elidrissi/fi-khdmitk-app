import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Artisan from '@/models/Artisan';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

// Helper to get user from token
async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

// GET - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = {};

    // If customer, get their bookings
    // If artisan, get bookings for their profile
    if (user.role === 'customer') {
      query.customer = user.userId;
    } else if (user.role === 'artisan') {
      const artisan = await Artisan.findOne({ user: user.userId });
      if (artisan) {
        query.artisan = artisan._id;
      }
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'artisan',
        populate: { path: 'user', select: 'fullName city avatar' }
      })
      .populate('customer', 'fullName phone city email')
      .sort({ createdAt: -1 })
      .lean();

    const transformedBookings = bookings.map((b: any) => ({
      id: b._id,
      artisan: {
        id: b.artisan?._id,
        name: b.artisan?.user?.fullName || 'Artisan',
        city: b.artisan?.user?.city,
        avatar: b.artisan?.user?.avatar,
      },
      customer: {
        id: b.customer?._id,
        name: b.customer?.fullName,
        phone: b.customer?.phone,
        city: b.customer?.city,
      },
      service: b.service,
      date: b.date,
      time: b.time,
      address: b.address,
      description: b.description,
      urgency: b.urgency,
      status: b.status,
      totalPrice: b.totalPrice,
      createdAt: b.createdAt,
    }));

    return NextResponse.json({ bookings: transformedBookings });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { artisanId, service, date, time, address, description, urgency } = body;

    const booking = await Booking.create({
      customer: user.userId,
      artisan: artisanId,
      service,
      date: new Date(date),
      time,
      address,
      description,
      urgency: urgency || 'normal',
      status: 'pending',
    });

    return NextResponse.json({
      message: 'Réservation créée avec succès',
      booking: {
        id: booking._id,
        status: booking.status,
        date: booking.date,
        time: booking.time,
      },
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
