import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import VerificationCode from '@/models/VerificationCode';
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email est requis' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Cet email est déjà vérifié' },
        { status: 400 }
      );
    }

    // Check rate limiting (max 1 code per minute)
    const recentCode = await VerificationCode.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) }, // within last minute
    });

    if (recentCode) {
      return NextResponse.json(
        { error: 'Veuillez attendre 1 minute avant de demander un nouveau code' },
        { status: 429 }
      );
    }

    // Generate new verification code
    const code = generateVerificationCode();

    // Delete old codes
    await VerificationCode.deleteMany({ email: email.toLowerCase() });

    // Save new code
    await VerificationCode.create({
      email: email.toLowerCase(),
      code,
      type: 'email_verification',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    // Send email
    const emailResult = await sendVerificationEmail(email, code, user.fullName);

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Un nouveau code de vérification a été envoyé à votre email',
    });
  } catch (error: any) {
    console.error('Resend code error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
