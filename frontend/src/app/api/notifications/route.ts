import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

// GET - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const query: any = { user: decoded.userId };
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({
      user: decoded.userId,
      isRead: false,
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();

    const body = await request.json();
    const { notificationIds, markAllRead } = body;

    if (markAllRead) {
      await Notification.updateMany(
        { user: decoded.userId, isRead: false },
        { isRead: true }
      );
    } else if (notificationIds && notificationIds.length > 0) {
      await Notification.updateMany(
        { _id: { $in: notificationIds }, user: decoded.userId },
        { isRead: true }
      );
    }

    const unreadCount = await Notification.countDocuments({
      user: decoded.userId,
      isRead: false,
    });

    return NextResponse.json({
      message: 'Notifications mises à jour',
      unreadCount,
    });
  } catch (error: any) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
