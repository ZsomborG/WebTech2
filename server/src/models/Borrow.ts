import mongoose, { Schema, Document } from 'mongoose';

export interface IBorrow extends Document {
  book: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'returned';
}

const borrowSchema = new Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'returned'],
    default: 'active',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IBorrow>('Borrow', borrowSchema);
