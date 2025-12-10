import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Artisan from '@/models/Artisan';
import Review from '@/models/Review';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

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

// PATCH - Update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status, rating, review } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }

    let updatedArtisan = null;

    // Update status
    if (status) {
      booking.status = status;

      // If completed, increment artisan's completed jobs
      if (status === 'completed') {
        updatedArtisan = await Artisan.findByIdAndUpdate(
          booking.artisan,
          { $inc: { completedJobs: 1 } },
          { new: true }
        );
      }
    }

    // Add review if provided
    if (rating && status === 'completed') {
      booking.rating = rating;
      booking.review = review;

      // Create review document
      await Review.create({
        booking: booking._id,
        customer: booking.customer,
        artisan: booking.artisan,
        rating,
        comment: review || '',
      });

      // Update artisan's rating
      const reviews = await Review.find({ artisan: booking.artisan });
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

      updatedArtisan = await Artisan.findByIdAndUpdate(
        booking.artisan,
        {
          rating: Math.round(avgRating * 10) / 10,
          totalReviews: reviews.length,
        },
        { new: true }
      );
    }

    await booking.save();

    // Return updated artisan stats for frontend to use
    return NextResponse.json({
      message: 'Réservation mise à jour',
      booking: {
        id: booking._id,
        status: booking.status,
      },
      artisan: updatedArtisan ? {
        completedJobs: updatedArtisan.completedJobs,
        rating: updatedArtisan.rating,
        totalReviews: updatedArtisan.totalReviews,
      } : null,
    });
  } catch (error: any) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }

    // Only allow cancellation if pending or confirmed
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return NextResponse.json(
        { error: 'Cette réservation ne peut pas être annulée' },
        { status: 400 }
      );
    }

    booking.status = 'cancelled';
    await booking.save();

    return NextResponse.json({
      message: 'Réservation annulée',
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
