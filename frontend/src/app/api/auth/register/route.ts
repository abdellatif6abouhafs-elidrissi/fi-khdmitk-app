import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Artisan from '@/models/Artisan';
import VerificationCode from '@/models/VerificationCode';
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email';
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
    console.log('=== REGISTER API CALLED ===');
    await connectDB();
    console.log('MongoDB connected');

    const body = await request.json();
    console.log('Registration data:', { email: body.email, fullName: body.fullName, city: body.city });
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
    console.log('Creating user...');
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      city,
      role: role || 'customer',
    });
    console.log('User created with ID:', user._id);

    // If artisan, create artisan profile
    if (role === 'artisan') {
      // Handle services - can be strings (category IDs) or objects
      const processedServices = services?.map((s: string | { category: string; name?: string; price?: string }) => {
        if (typeof s === 'string') {
          return {
            category: s,
            name: categoryLabels[s] || s,
            price: '150-300 MAD/h',
          };
        } else {
          // It's already an object
          return {
            category: s.category,
            name: s.name || categoryLabels[s.category] || s.category,
            price: s.price || '150-300 MAD/h',
          };
        }
      }) || [];

      await Artisan.create({
        user: user._id,
        bio: bio || '',
        experience: experience || 0,
        services: processedServices,
      });
    }

    // Generate verification code
    const code = generateVerificationCode();

    // Delete any existing verification codes for this email
    await VerificationCode.deleteMany({ email: email.toLowerCase() });

    // Save verification code
    await VerificationCode.create({
      email: email.toLowerCase(),
      code,
      type: 'email_verification',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, code, fullName);

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Don't fail registration, but log the error
    }

    // Generate token (user still needs to verify email)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Inscription réussie. Un code de vérification a été envoyé à votre email.',
      requiresVerification: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        isVerified: false,
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
