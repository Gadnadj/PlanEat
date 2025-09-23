import mongoose, { Document, Schema } from 'mongoose';

export interface IRecipe extends Document {
  id: string;
  userId?: string; // User ID who created the recipe (undefined for developer recipes)
  title: string;
  description: string;
  image: string;
  emoji: string;
  ingredients: {
    name: string;
    amount: string;
    unit?: string;
  }[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  externalId?: string; // External API ID
  source: 'spoonacular' | 'edamam' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>({
  userId: {
    type: String,
    ref: 'User',
    required: false // Optional for developer recipes
  },
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
    trim: true
  },
  emoji: {
    type: String,
    required: [true, 'Emoji is required'],
    default: '🍽️'
  },
  ingredients: [{
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true
    },
    amount: {
      type: String,
      required: [true, 'Amount is required'],
      trim: true
    },
    unit: {
      type: String,
      trim: true
    }
  }],
  instructions: [{
    type: String,
    required: [true, 'Instructions are required'],
    trim: true
  }],
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [0, 'Preparation time cannot be negative']
  },
  cookTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: [0, 'Cooking time cannot be negative']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Number of servings must be at least 1']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  nutrition: {
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories cannot be negative']
    },
    protein: {
      type: Number,
      required: [true, 'Protein is required'],
      min: [0, 'Protein cannot be negative']
    },
    carbs: {
      type: Number,
      required: [true, 'Carbs are required'],
      min: [0, 'Carbs cannot be negative']
    },
    fat: {
      type: Number,
      required: [true, 'Fat is required'],
      min: [0, 'Fat cannot be negative']
    }
  },
  externalId: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    enum: ['spoonacular', 'edamam', 'manual'],
    default: 'manual'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id as string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (ret as any)._id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Indexes to optimize searches
RecipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
RecipeSchema.index({ category: 1 });
RecipeSchema.index({ difficulty: 1 });
RecipeSchema.index({ prepTime: 1 });
RecipeSchema.index({ externalId: 1 });

// Check if model already exists before creating it
const Recipe = (mongoose.models.Recipe as mongoose.Model<IRecipe>) || mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;
