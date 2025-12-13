import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  artisan: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  method: 'paypal' | 'cmi' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  cmiTransactionId?: string;
  metadata?: Record<string, any>;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
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
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'MAD',
    },
    method: {
      type: String,
      enum: ['paypal', 'cmi', 'cash'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
    },
    paypalOrderId: {
      type: String,
    },
    paypalCaptureId: {
      type: String,
    },
    cmiTransactionId: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ booking: 1 });
PaymentSchema.index({ customer: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ transactionId: 1 });

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
