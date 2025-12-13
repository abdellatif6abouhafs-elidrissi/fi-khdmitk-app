import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Artisan from '@/models/Artisan';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const artisan = await Artisan.findByIdAndUpdate(id, body, { new: true }).populate('user', 'fullName email');

    if (!artisan) {
      return NextResponse.json({ error: 'Artisan non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ artisan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;

    const artisan = await Artisan.findById(id);
    if (!artisan) {
      return NextResponse.json({ error: 'Artisan non trouvé' }, { status: 404 });
    }

    // Delete user associated with artisan
    await User.findByIdAndDelete(artisan.user);

    // Delete artisan
    await Artisan.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Artisan supprimé' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
