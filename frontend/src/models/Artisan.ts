import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IService {
  category: string;
  name: string;
  price: string;
  description?: string;
}

export interface IPortfolio {
  image: string;
  title: string;
  description?: string;
}

export interface IArtisan extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  bio: string;
  experience: number;
  services: IService[];
  portfolio: IPortfolio[];
  availability: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  rating: number;
  totalReviews: number;
  completedJobs: number;
  isAvailable: boolean;
  responseTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },
});

const PortfolioSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
});

const ArtisanSchema = new Schema<IArtisan>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: '',
    },
    experience: {
      type: Number,
      default: 0,
    },
    services: [ServiceSchema],
    portfolio: [PortfolioSchema],
    availability: {
      monday: { type: String, default: '08:00 - 18:00' },
      tuesday: { type: String, default: '08:00 - 18:00' },
      wednesday: { type: String, default: '08:00 - 18:00' },
      thursday: { type: String, default: '08:00 - 18:00' },
      friday: { type: String, default: '08:00 - 18:00' },
      saturday: { type: String, default: '09:00 - 14:00' },
      sunday: { type: String, default: 'Fermé' },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    responseTime: {
      type: String,
      default: '< 1 heure',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual populate for user data
ArtisanSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
});

ArtisanSchema.set('toJSON', { virtuals: true });
ArtisanSchema.set('toObject', { virtuals: true });

const Artisan: Model<IArtisan> = mongoose.models.Artisan || mongoose.model<IArtisan>('Artisan', ArtisanSchema);

export default Artisan;
