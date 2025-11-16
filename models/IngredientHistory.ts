import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredientHistory extends Document {
  _id: string;
  userId: string;
  name: string;
  category: string;
  lastUsedAt: Date;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const IngredientHistorySchema = new Schema<IIngredientHistory>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true,
    lowercase: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Fruits & Vegetables', 'Meat & Fish', 'Dairy Products', 'Groceries', 'Bakery', 'Beverages', 'Other'],
    default: 'Other'
  },
  lastUsedAt: {
    type: Date,
    default: Date.now
  },
  usageCount: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (ret as any)._id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Index unique pour éviter les doublons (userId + name)
IngredientHistorySchema.index({ userId: 1, name: 1 }, { unique: true });

// Indexes to optimize user searches
IngredientHistorySchema.index({ userId: 1, lastUsedAt: -1 });
IngredientHistorySchema.index({ userId: 1, usageCount: -1 });

// Check if model already exists before creating it
const IngredientHistory = mongoose.models.IngredientHistory || mongoose.model<IIngredientHistory>('IngredientHistory', IngredientHistorySchema);

export default IngredientHistory;

