import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Artisan from '@/models/Artisan';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Ensure User model is registered for populate
    void User;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const minRating = searchParams.get('minRating');
    const available = searchParams.get('available');

    // Build query
    let query: any = {};

    if (category) {
      query['services.category'] = category;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (available === 'true') {
      query.isAvailable = true;
    }

    // Get artisans with user data
    let artisans = await Artisan.find(query)
      .populate('user', 'fullName email phone city avatar isVerified')
      .sort({ rating: -1, totalReviews: -1 })
      .lean();

    // Filter by city (from user)
    if (city) {
      artisans = artisans.filter((a: any) =>
        a.user?.city?.toLowerCase() === city.toLowerCase()
      );
    }

    // Filter by search (name or bio)
    if (search) {
      const searchLower = search.toLowerCase();
      artisans = artisans.filter((a: any) =>
        a.user?.fullName?.toLowerCase().includes(searchLower) ||
        a.bio?.toLowerCase().includes(searchLower)
      );
    }

    // Transform data
    const transformedArtisans = artisans.map((artisan: any) => ({
      id: artisan._id,
      fullName: artisan.user?.fullName || 'Artisan',
      email: artisan.user?.email,
      phone: artisan.user?.phone,
      city: artisan.user?.city || '',
      avatar: artisan.user?.avatar,
      isVerified: artisan.user?.isVerified || false,
      bio: artisan.bio,
      experience: artisan.experience,
      services: artisan.services,
      rating: artisan.rating,
      totalReviews: artisan.totalReviews,
      completedJobs: artisan.completedJobs,
      isAvailable: artisan.isAvailable,
      responseTime: artisan.responseTime,
    }));

    return NextResponse.json({ artisans: transformedArtisans });
  } catch (error: any) {
    console.error('Get artisans error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
