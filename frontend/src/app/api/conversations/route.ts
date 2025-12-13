import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

// GET - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();

    const conversations = await Conversation.find({
      participants: decoded.userId,
    })
      .populate('participants', 'fullName avatar role')
      .populate('booking', 'service status')
      .sort({ 'lastMessage.createdAt': -1, updatedAt: -1 })
      .lean();

    // Transform conversations to add unread count
    const transformedConversations = conversations.map((conv: any) => {
      const unreadCount = conv.messages.filter(
        (m: any) => !m.isRead && m.sender.toString() !== decoded.userId
      ).length;

      const otherParticipant = conv.participants.find(
        (p: any) => p._id.toString() !== decoded.userId
      );

      return {
        id: conv._id,
        otherUser: {
          id: otherParticipant?._id,
          fullName: otherParticipant?.fullName || 'Utilisateur',
          avatar: otherParticipant?.avatar,
          role: otherParticipant?.role,
        },
        booking: conv.booking,
        lastMessage: conv.lastMessage,
        unreadCount,
        updatedAt: conv.updatedAt,
      };
    });

    return NextResponse.json({ conversations: transformedConversations });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Create or get existing conversation
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();

    const body = await request.json();
    const { recipientId, bookingId } = body;

    if (!recipientId) {
      return NextResponse.json(
        { error: 'Destinataire requis' },
        { status: 400 }
      );
    }

    // Check if conversation already exists between these users
    let conversation = await Conversation.findOne({
      participants: { $all: [decoded.userId, recipientId] },
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [decoded.userId, recipientId],
        booking: bookingId,
        messages: [],
      });
    }

    // Populate and return
    await conversation.populate('participants', 'fullName avatar role');

    const otherParticipant = (conversation.participants as any[]).find(
      (p: any) => p._id.toString() !== decoded.userId
    );

    return NextResponse.json({
      conversation: {
        id: conversation._id,
        otherUser: {
          id: otherParticipant?._id,
          fullName: otherParticipant?.fullName || 'Utilisateur',
          avatar: otherParticipant?.avatar,
          role: otherParticipant?.role,
        },
        messages: conversation.messages,
      },
    });
  } catch (error: any) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
