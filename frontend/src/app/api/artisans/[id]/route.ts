import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Artisan from '@/models/Artisan';
import Review from '@/models/Review';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    const artisan = await Artisan.findById(id)
      .populate('user', 'fullName email phone city avatar isVerified')
      .lean();

    if (!artisan) {
      return NextResponse.json(
        { error: 'Artisan non trouvé' },
        { status: 404 }
      );
    }

    // Get reviews
    const reviews = await Review.find({ artisan: id })
      .populate('customer', 'fullName avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const transformedArtisan = {
      id: artisan._id,
      fullName: (artisan as any).user?.fullName || 'Artisan',
      email: (artisan as any).user?.email,
      phone: (artisan as any).user?.phone,
      city: (artisan as any).user?.city || '',
      avatar: (artisan as any).user?.avatar,
      isVerified: (artisan as any).user?.isVerified || false,
      bio: artisan.bio,
      experience: artisan.experience,
      services: artisan.services,
      portfolio: artisan.portfolio,
      availability: artisan.availability,
      rating: artisan.rating,
      totalReviews: artisan.totalReviews,
      completedJobs: artisan.completedJobs,
      isAvailable: artisan.isAvailable,
      responseTime: artisan.responseTime,
      reviews: reviews.map((r: any) => ({
        id: r._id,
        userName: r.customer?.fullName || 'Client',
        avatar: r.customer?.avatar,
        rating: r.rating,
        comment: r.comment,
        date: r.createdAt,
      })),
    };

    return NextResponse.json({ artisan: transformedArtisan });
  } catch (error: any) {
    console.error('Get artisan error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
