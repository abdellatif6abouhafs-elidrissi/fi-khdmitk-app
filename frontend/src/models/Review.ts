import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  artisan: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual populate
ReviewSchema.virtual('customerDetails', {
  ref: 'User',
  localField: 'customer',
  foreignField: '_id',
  justOne: true,
});

ReviewSchema.set('toJSON', { virtuals: true });
ReviewSchema.set('toObject', { virtuals: true });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
