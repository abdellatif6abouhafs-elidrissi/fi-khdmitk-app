import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Artisan from '@/models/Artisan';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    await connectDB();

    // Find artisan by user ID
    const artisan = await Artisan.findOne({ user: decoded.userId });
    
    if (!artisan) {
      return NextResponse.json({ 
        error: 'Artisan not found',
        userId: decoded.userId,
        role: decoded.role
      }, { status: 404 });
    }

    // Get completed bookings count from database
    const completedBookingsCount = await Booking.countDocuments({ 
      artisan: artisan._id, 
      status: 'completed' 
    });

    return NextResponse.json({
      artisan: {
        id: artisan._id,
        userId: artisan.user,
        completedJobs: artisan.completedJobs,
        rating: artisan.rating,
        totalReviews: artisan.totalReviews,
        isAvailable: artisan.isAvailable,
      },
      bookings: {
        completedCount: completedBookingsCount,
      },
      debug: {
        completedJobsInArtisan: artisan.completedJobs,
        completedBookingsInDB: completedBookingsCount,
        mismatch: artisan.completedJobs !== completedBookingsCount,
      }
    });
  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
