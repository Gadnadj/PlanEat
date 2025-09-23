import mongoose, { Document, Schema } from 'mongoose';

export interface IShoppingItem extends Document {
  _id: string;
  userId: string;
  name: string;
  category: string;
  quantity?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShoppingItemSchema = new Schema<IShoppingItem>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Fruits & Vegetables', 'Meat & Fish', 'Dairy Products', 'Groceries', 'Bakery', 'Beverages', 'Other'],
    default: 'Other'
  },
  quantity: {
    type: String,
    trim: true,
    maxlength: [50, 'Quantity cannot exceed 50 characters']
  },
  isCompleted: {
    type: Boolean,
    default: false
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

// Indexes to optimize user searches
ShoppingItemSchema.index({ userId: 1 });
ShoppingItemSchema.index({ userId: 1, isCompleted: 1 });
ShoppingItemSchema.index({ userId: 1, category: 1 });

// Check if model already exists before creating it
const ShoppingItem = mongoose.models.ShoppingItem || mongoose.model<IShoppingItem>('ShoppingItem', ShoppingItemSchema);

export default ShoppingItem;
