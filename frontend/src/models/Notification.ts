import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: 'booking_new' | 'booking_confirmed' | 'booking_cancelled' | 'booking_completed' | 'review_received' | 'system';
  title: string;
  message: string;
  data?: {
    bookingId?: string;
    artisanId?: string;
    customerId?: string;
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['booking_new', 'booking_confirmed', 'booking_cancelled', 'booking_completed', 'review_received', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      bookingId: String,
      artisanId: String,
      customerId: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, isRead: 1 });

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
