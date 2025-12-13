import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Artisan from '@/models/Artisan';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    let data: any = {};

    if (type === 'users' || type === 'all') {
      const users = await User.find({ role: { $ne: 'admin' } })
        .select('fullName email phone city role isVerified createdAt')
        .sort({ createdAt: -1 })
        .lean();

      data.users = users.map((u: any) => ({
        'Nom Complet': u.fullName,
        'Email': u.email,
        'Téléphone': u.phone || 'N/A',
        'Ville': u.city || 'N/A',
        'Rôle': u.role === 'artisan' ? 'Artisan' : 'Client',
        'Vérifié': u.isVerified ? 'Oui' : 'Non',
        'Date Inscription': new Date(u.createdAt).toLocaleDateString('fr-FR'),
      }));
    }

    if (type === 'artisans' || type === 'all') {
      const artisans = await Artisan.find()
        .populate('user', 'fullName email phone city')
        .lean();

      data.artisans = artisans.map((a: any) => ({
        'Nom': a.user?.fullName || 'N/A',
        'Email': a.user?.email || 'N/A',
        'Téléphone': a.user?.phone || 'N/A',
        'Ville': a.user?.city || 'N/A',
        'Note': a.rating?.toFixed(1) || '0.0',
        'Avis': a.totalReviews || 0,
        'Travaux Complétés': a.completedJobs || 0,
        'Disponible': a.isAvailable ? 'Oui' : 'Non',
      }));
    }

    if (type === 'bookings' || type === 'all') {
      const bookings = await Booking.find()
        .populate('customer', 'fullName email phone')
        .populate({ path: 'artisan', populate: { path: 'user', select: 'fullName' } })
        .sort({ createdAt: -1 })
        .lean();

      const statusLabels: Record<string, string> = {
        pending: 'En attente',
        confirmed: 'Confirmée',
        in_progress: 'En cours',
        completed: 'Terminée',
        cancelled: 'Annulée',
      };

      data.bookings = bookings.map((b: any) => ({
        'Client': b.customer?.fullName || 'N/A',
        'Email Client': b.customer?.email || 'N/A',
        'Artisan': b.artisan?.user?.fullName || 'N/A',
        'Service': typeof b.service === 'object' ? b.service?.name || b.service?.category : b.service,
        'Date': b.date,
        'Heure': b.time,
        'Adresse': b.address || 'N/A',
        'Prix': b.totalPrice ? `${b.totalPrice} MAD` : 'N/A',
        'Statut': statusLabels[b.status] || b.status,
        'Date Création': new Date(b.createdAt).toLocaleDateString('fr-FR'),
      }));
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
