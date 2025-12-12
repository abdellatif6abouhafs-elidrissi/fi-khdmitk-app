import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVerificationCode extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  code: string;
  type: 'email_verification' | 'password_reset';
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const VerificationCodeSchema = new Schema<IVerificationCode>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['email_verification', 'password_reset'],
      default: 'email_verification',
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index to auto-delete expired codes
VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster lookups
VerificationCodeSchema.index({ email: 1, code: 1 });

const VerificationCode: Model<IVerificationCode> =
  mongoose.models.VerificationCode ||
  mongoose.model<IVerificationCode>('VerificationCode', VerificationCodeSchema);

export default VerificationCode;
