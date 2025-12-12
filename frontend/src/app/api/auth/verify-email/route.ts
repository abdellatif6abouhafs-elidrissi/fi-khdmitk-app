import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import VerificationCode from '@/models/VerificationCode';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email et code sont requis' },
        { status: 400 }
      );
    }

    // Find the verification code
    const verificationCode = await VerificationCode.findOne({
      email: email.toLowerCase(),
      code,
      type: 'email_verification',
      used: false,
    });

    if (!verificationCode) {
      return NextResponse.json(
        { error: 'Code de vérification invalide ou expiré' },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (verificationCode.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Le code de vérification a expiré. Veuillez en demander un nouveau.' },
        { status: 400 }
      );
    }

    // Mark code as used
    verificationCode.used = true;
    await verificationCode.save();

    // Update user as verified
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Email vérifié avec succès!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
