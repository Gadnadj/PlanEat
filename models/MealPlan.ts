import mongoose, { Document, Schema } from 'mongoose';

export interface IMealPlan extends Document {
  _id: string;
  userId: string;
  preferences: {
    dietType: string;
    allergies: string[];
    dislikes: string[];
    numberOfPeople: number;
    budget: string;
    cookingTime: string;
  };
  mealPlan: {
    [key: string]: {
      morning: {
        name: string;
        ingredients: string[];
        time: string;
        emoji?: string;
      };
      lunch: {
        name: string;
        ingredients: string[];
        time: string;
        emoji?: string;
      };
      dinner: {
        name: string;
        ingredients: string[];
        time: string;
        emoji?: string;
      };
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const MealPlanSchema = new Schema<IMealPlan>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  preferences: {
    dietType: {
      type: String,
      required: [true, 'Diet type is required'],
      enum: ['omnivore', 'vegetarian', 'vegan', 'pescatarian']
    },
    allergies: [{
      type: String,
      trim: true
    }],
    dislikes: [{
      type: String,
      trim: true
    }],
    numberOfPeople: {
      type: Number,
      required: [true, 'Number of people is required'],
      min: [1, 'Number of people must be at least 1'],
      max: [20, 'Number of people cannot exceed 20'],
      default: 1
    },
    budget: {
      type: String,
      required: [true, 'Budget is required'],
      enum: ['low', 'medium', 'high']
    },
    cookingTime: {
      type: String,
      required: [true, 'Cooking time is required'],
      enum: ['quick', 'medium', 'long']
    }
  },
  mealPlan: {
    type: Schema.Types.Mixed,
    required: [true, 'Meal plan is required']
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
MealPlanSchema.index({ userId: 1 });
MealPlanSchema.index({ userId: 1, createdAt: -1 }); // To retrieve the most recent meal plans

// Check if model already exists before creating it
const MealPlan = mongoose.models.MealPlan || mongoose.model<IMealPlan>('MealPlan', MealPlanSchema);

export default MealPlan;
