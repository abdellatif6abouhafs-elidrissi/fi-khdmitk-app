import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Artisan from '@/models/Artisan';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: any = {};

    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = { $ne: true };
    } else if (status === 'rejected') {
      query.isApproved = false;
    }

    let artisansQuery = Artisan.find(query)
      .populate('user', 'fullName email phone city isVerified')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Artisan.countDocuments(query);
    let artisans = await artisansQuery.lean();

    // Filter by search if provided
    if (search) {
      artisans = artisans.filter((a: any) =>
        a.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        a.services?.some((s: any) => s.name?.toLowerCase().includes(search.toLowerCase()))
      );
    }

    return NextResponse.json({
      artisans,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
