import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Artisan from '@/models/Artisan';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // If user is an artisan, fetch artisan data
    let artisanData = null;
    if (user.role === 'artisan') {
      const artisan = await Artisan.findOne({ user: user._id });
      if (artisan) {
        artisanData = {
          id: artisan._id,
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
        };
      }
    }

    return NextResponse.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      artisan: artisanData,
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
