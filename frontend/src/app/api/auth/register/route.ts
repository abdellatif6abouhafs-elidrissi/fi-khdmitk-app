import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Artisan from '@/models/Artisan';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

// Category labels mapping
const categoryLabels: Record<string, string> = {
  plumbing: 'Plomberie',
  electrical: 'Électricité',
  carpentry: 'Menuiserie',
  painting: 'Peinture',
  hvac: 'Climatisation',
  cleaning: 'Nettoyage',
  gardening: 'Jardinage',
  masonry: 'Maçonnerie',
  locksmith: 'Serrurerie',
  appliance: 'Électroménager',
  moving: 'Déménagement',
  other: 'Autre',
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fullName, email, phone, password, city, role, bio, services, experience } = body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      city,
      role: role || 'customer',
    });

    // If artisan, create artisan profile
    if (role === 'artisan') {
      await Artisan.create({
        user: user._id,
        bio: bio || '',
        experience: experience || 0,
        services: services?.map((s: string) => ({
          category: s,
          name: categoryLabels[s] || s,
          price: '150-300 MAD/h',
        })) || [],
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Inscription réussie',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
