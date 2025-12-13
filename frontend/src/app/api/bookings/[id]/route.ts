import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Artisan from '@/models/Artisan';
import Review from '@/models/Review';
import User from '@/models/User';
import { createNotification, notificationMessages } from '@/lib/notifications';
import { sendBookingNotificationEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'fi-khidmatik-secret';

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

// PATCH - Update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status, rating, review } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }

    let updatedArtisan = null;

    // Update status
    if (status) {
      const oldStatus = booking.status;
      booking.status = status;

      // If completed, increment artisan's completed jobs
      if (status === 'completed') {
        updatedArtisan = await Artisan.findByIdAndUpdate(
          booking.artisan,
          { $inc: { completedJobs: 1 } },
          { new: true }
        );
      }

      // Create notifications for status changes
      if (status !== oldStatus) {
        const artisan = await Artisan.findById(booking.artisan).populate('user', 'fullName');
        const customer = await User.findById(booking.customer);
        const artisanUser = artisan?.user as any;
        const serviceName = booking.service?.name || 'service';

        if (status === 'confirmed' && customer) {
          const msg = notificationMessages.booking_confirmed(artisanUser?.fullName || 'Artisan');
          await createNotification({
            userId: booking.customer.toString(),
            type: 'booking_confirmed',
            title: msg.title,
            message: msg.message,
            data: { bookingId: booking._id.toString(), artisanId: booking.artisan.toString() },
          });
          // Send email notification to customer
          await sendBookingNotificationEmail({
            toEmail: customer.email,
            toName: customer.fullName,
            bookingDate: booking.date?.toLocaleDateString?.() || String(booking.date),
            bookingTime: booking.time,
            serviceName: serviceName,
            artisanName: artisanUser?.fullName || 'Artisan',
            status: 'confirmed',
          });
        } else if (status === 'completed' && customer) {
          const msg = notificationMessages.booking_completed(artisanUser?.fullName || 'Artisan');
          await createNotification({
            userId: booking.customer.toString(),
            type: 'booking_completed',
            title: msg.title,
            message: msg.message,
            data: { bookingId: booking._id.toString(), artisanId: booking.artisan.toString() },
          });
          // Send email notification to customer
          await sendBookingNotificationEmail({
            toEmail: customer.email,
            toName: customer.fullName,
            bookingDate: booking.date?.toLocaleDateString?.() || String(booking.date),
            bookingTime: booking.time,
            serviceName: serviceName,
            artisanName: artisanUser?.fullName || 'Artisan',
            status: 'completed',
          });
        } else if (status === 'cancelled') {
          // Notify the other party about cancellation
          const isArtisanCancelling = user.role === 'artisan';
          const notifyUserId = isArtisanCancelling ? booking.customer.toString() : artisanUser?._id?.toString();
          const cancellerName = isArtisanCancelling ? (artisanUser?.fullName || 'Artisan') : (customer?.fullName || 'Client');

          if (notifyUserId) {
            const msg = notificationMessages.booking_cancelled(cancellerName, isArtisanCancelling);
            await createNotification({
              userId: notifyUserId,
              type: 'booking_cancelled',
              title: msg.title,
              message: msg.message,
              data: { bookingId: booking._id.toString() },
            });
            // Send email notification
            const notifyUser = isArtisanCancelling ? customer : artisanUser;
            if (notifyUser?.email) {
              await sendBookingNotificationEmail({
                toEmail: notifyUser.email,
                toName: notifyUser.fullName,
                bookingDate: booking.date?.toLocaleDateString?.() || String(booking.date),
                bookingTime: booking.time,
                serviceName: serviceName,
                status: 'cancelled',
                message: `La réservation a été annulée par ${cancellerName}`,
              });
            }
          }
        }
      }
    }

    // Add review if provided
    if (rating && status === 'completed') {
      booking.rating = rating;
      booking.review = review;

      // Create review document
      await Review.create({
        booking: booking._id,
        customer: booking.customer,
        artisan: booking.artisan,
        rating,
        comment: review || '',
      });

      // Update artisan's rating
      const reviews = await Review.find({ artisan: booking.artisan });
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

      updatedArtisan = await Artisan.findByIdAndUpdate(
        booking.artisan,
        {
          rating: Math.round(avgRating * 10) / 10,
          totalReviews: reviews.length,
        },
        { new: true }
      );
    }

    await booking.save();

    // Return updated artisan stats for frontend to use
    return NextResponse.json({
      message: 'Réservation mise à jour',
      booking: {
        id: booking._id,
        status: booking.status,
      },
      artisan: updatedArtisan ? {
        completedJobs: updatedArtisan.completedJobs,
        rating: updatedArtisan.rating,
        totalReviews: updatedArtisan.totalReviews,
      } : null,
    });
  } catch (error: any) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
    }

    // Only allow cancellation if pending or confirmed
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return NextResponse.json(
        { error: 'Cette réservation ne peut pas être annulée' },
        { status: 400 }
      );
    }

    booking.status = 'cancelled';
    await booking.save();

    return NextResponse.json({
      message: 'Réservation annulée',
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
