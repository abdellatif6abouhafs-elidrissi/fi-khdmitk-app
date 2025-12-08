import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  artisan: mongoose.Types.ObjectId;
  service: {
    category: string;
    name: string;
    price: string;
  };
  date: Date;
  time: string;
  address: string;
  description: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalPrice?: number;
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    artisan: {
      type: Schema.Types.ObjectId,
      ref: 'Artisan',
      required: true,
    },
    service: {
      category: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: String, required: true },
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    urgency: {
      type: String,
      enum: ['normal', 'urgent', 'emergency'],
      default: 'normal',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalPrice: {
      type: Number,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Populate customer and artisan details
BookingSchema.virtual('customerDetails', {
  ref: 'User',
  localField: 'customer',
  foreignField: '_id',
  justOne: true,
});

BookingSchema.virtual('artisanDetails', {
  ref: 'Artisan',
  localField: 'artisan',
  foreignField: '_id',
  justOne: true,
});

BookingSchema.set('toJSON', { virtuals: true });
BookingSchema.set('toObject', { virtuals: true });

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
