import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Artisan from '@/models/Artisan';
import Booking from '@/models/Booking';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

// GET - Get reviews for an artisan
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const artisanId = searchParams.get('artisanId');

    if (!artisanId) {
      return NextResponse.json(
        { error: 'Artisan ID requis' },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ artisan: artisanId })
      .populate('customer', 'fullName')
      .sort({ createdAt: -1 });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token requis' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();

    const body = await request.json();
    const { bookingId, artisanId, rating, comment } = body;

    // Validate input
    if (!bookingId || !artisanId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La note doit être entre 1 et 5' },
        { status: 400 }
      );
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return NextResponse.json(
        { error: 'Vous avez déjà laissé un avis pour cette réservation' },
        { status: 400 }
      );
    }

    // Verify booking belongs to user and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    if (booking.customer.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    if (booking.status !== 'completed') {
      return NextResponse.json(
        { error: 'La réservation doit être terminée pour laisser un avis' },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      customer: decoded.userId,
      artisan: artisanId,
      rating,
      comment,
    });

    // Update artisan rating
    const allReviews = await Review.find({ artisan: artisanId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalRating / allReviews.length) * 10) / 10;

    await Artisan.findByIdAndUpdate(artisanId, {
      rating: avgRating,
      totalReviews: allReviews.length,
    });

    // Mark booking as reviewed (using existing rating field)
    booking.rating = rating;
    booking.review = comment;
    await booking.save();

    return NextResponse.json({
      message: 'Avis ajouté avec succès',
      review,
    });
  } catch (error: any) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
