import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactDocument extends Document {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContactDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact: Model<IContactDocument> =
  mongoose.models.Contact ||
  mongoose.model<IContactDocument>('Contact', ContactSchema);

export default Contact;