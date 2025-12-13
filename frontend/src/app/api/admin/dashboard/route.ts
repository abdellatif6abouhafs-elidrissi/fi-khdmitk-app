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

    // Get monthly stats for charts (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const [monthlyBookings, monthlyRevenue] = await Promise.all([
      Booking.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo }, status: 'completed' } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            total: { $sum: '$totalPrice' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const chartData = {
      bookings: [] as { month: string; count: number }[],
      revenue: [] as { month: string; total: number }[],
    };

    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - 11 + i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const bookingData = monthlyBookings.find((b: any) => b._id.year === year && b._id.month === month);
      const revenueDataMonth = monthlyRevenue.find((r: any) => r._id.year === year && r._id.month === month);

      chartData.bookings.push({ month: monthNames[month - 1], count: bookingData?.count || 0 });
      chartData.revenue.push({ month: monthNames[month - 1], total: revenueDataMonth?.total || 0 });
    }

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
      chartData,
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
