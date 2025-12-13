import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

// GET - Get conversation messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const conversation = await Conversation.findById(id)
      .populate('participants', 'fullName avatar role')
      .lean();

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p: any) => p._id.toString() === decoded.userId
    );

    if (!isParticipant) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Mark messages as read
    await Conversation.updateOne(
      { _id: id },
      {
        $set: {
          'messages.$[elem].isRead': true,
        },
      },
      {
        arrayFilters: [
          { 'elem.sender': { $ne: new mongoose.Types.ObjectId(decoded.userId) } },
        ],
      }
    );

    const otherParticipant = conversation.participants.find(
      (p: any) => p._id.toString() !== decoded.userId
    );

    return NextResponse.json({
      conversation: {
        id: conversation._id,
        otherUser: {
          id: otherParticipant?._id,
          fullName: (otherParticipant as any)?.fullName || 'Utilisateur',
          avatar: (otherParticipant as any)?.avatar,
          role: (otherParticipant as any)?.role,
        },
        messages: conversation.messages.map((m: any) => ({
          id: m._id,
          sender: m.sender,
          content: m.content,
          createdAt: m.createdAt,
          isRead: m.isRead,
          isMine: m.sender.toString() === decoded.userId,
        })),
      },
    });
  } catch (error: any) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === decoded.userId
    );

    if (!isParticipant) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Add message
    const newMessage = {
      sender: new mongoose.Types.ObjectId(decoded.userId),
      content: content.trim(),
      createdAt: new Date(),
      isRead: false,
    };

    conversation.messages.push(newMessage as any);
    conversation.lastMessage = {
      content: content.trim(),
      sender: new mongoose.Types.ObjectId(decoded.userId),
      createdAt: new Date(),
    };

    await conversation.save();

    const savedMessage = conversation.messages[conversation.messages.length - 1];

    return NextResponse.json({
      message: {
        id: savedMessage._id,
        sender: savedMessage.sender,
        content: savedMessage.content,
        createdAt: savedMessage.createdAt,
        isRead: savedMessage.isRead,
        isMine: true,
      },
    });
  } catch (error: any) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
