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

    // Get current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get stats
    const [
      totalUsers,
      totalArtisans,
      totalBookings,
      pendingBookings,
      completedBookings,
      newUsersThisMonth,
      newArtisansThisMonth,
      recentBookings,
      recentUsers,
      revenueData,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Artisan.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      User.countDocuments({ createdAt: { $gte: monthStart }, role: { $ne: 'admin' } }),
      User.countDocuments({ createdAt: { $gte: monthStart }, role: 'artisan' }),
      Booking.find()
        .populate('customer', 'fullName')
        .populate({ path: 'artisan', populate: { path: 'user', select: 'fullName' } })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      User.find({ role: { $ne: 'admin' } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('fullName email role createdAt isVerified')
        .lean(),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalArtisans,
        totalBookings,
        pendingBookings,
        completedBookings,
        totalRevenue,
        newUsersThisMonth,
        newArtisansThisMonth,
      },
      recentBookings,
      recentUsers,
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
