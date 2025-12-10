import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Artisan from '@/models/Artisan';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

// PATCH - Update artisan profile
export async function PATCH(request: NextRequest) {
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
    const { fullName, phone, city, bio, experience, isAvailable, services } = body;

    // Update user info
    const userUpdate: Record<string, any> = {};
    if (fullName) userUpdate.fullName = fullName;
    if (phone) userUpdate.phone = phone;
    if (city) userUpdate.city = city;

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(decoded.userId, userUpdate);
    }

    // Update artisan info
    const artisan = await Artisan.findOne({ user: decoded.userId });
    if (!artisan) {
      return NextResponse.json(
        { error: 'Profil artisan non trouvé' },
        { status: 404 }
      );
    }

    const artisanUpdate: Record<string, any> = {};
    if (bio !== undefined) artisanUpdate.bio = bio;
    if (experience !== undefined) artisanUpdate.experience = experience;
    if (isAvailable !== undefined) artisanUpdate.isAvailable = isAvailable;
    if (services) artisanUpdate.services = services;

    if (Object.keys(artisanUpdate).length > 0) {
      await Artisan.findByIdAndUpdate(artisan._id, artisanUpdate);
    }

    // Fetch updated data
    const user = await User.findById(decoded.userId).select('-password');
    const updatedArtisan = await Artisan.findOne({ user: decoded.userId });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profil mis à jour',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
      },
      artisan: updatedArtisan,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
