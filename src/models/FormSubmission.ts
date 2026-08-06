import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFormSubmissionDocument extends Document {
  applicantName: string;
  applicantEmail: string;
  message: string;
  referrerId: mongoose.Types.ObjectId;
  referrerName: string;
  createdAt: Date;
  updatedAt: Date;
}

const FormSubmissionSchema = new Schema<IFormSubmissionDocument>(
  {
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: [true, 'Applicant email is required'],
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referrerName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FormSubmission: Model<IFormSubmissionDocument> =
  mongoose.models.FormSubmission ||
  mongoose.model<IFormSubmissionDocument>('FormSubmission', FormSubmissionSchema);

export default FormSubmission;