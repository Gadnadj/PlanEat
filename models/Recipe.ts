import mongoose, { Document, Schema } from 'mongoose';

export interface IRecipe extends Document {
  id: string;
  userId?: string; // ID de l'utilisateur qui a créé la recette (undefined pour les recettes du développeur)
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
  prepTime: number; // en minutes
  cookTime: number; // en minutes
  servings: number;
  difficulty: 'facile' | 'moyen' | 'difficile';
  category: string;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  externalId?: string; // ID de l'API externe
  source: 'spoonacular' | 'edamam' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>({
  userId: {
    type: String,
    ref: 'User',
    required: false // Optionnel pour les recettes du développeur
  },
  title: {
    type: String,
    required: [true, 'Le titre de la recette est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  image: {
    type: String,
    required: [true, 'L\'image est requise'],
    trim: true
  },
  emoji: {
    type: String,
    required: [true, 'L\'emoji est requis'],
    default: '🍽️'
  },
  ingredients: [{
    name: {
      type: String,
      required: [true, 'Le nom de l\'ingrédient est requis'],
      trim: true
    },
    amount: {
      type: String,
      required: [true, 'La quantité est requise'],
      trim: true
    },
    unit: {
      type: String,
      trim: true
    }
  }],
  instructions: [{
    type: String,
    required: [true, 'Les instructions sont requises'],
    trim: true
  }],
  prepTime: {
    type: Number,
    required: [true, 'Le temps de préparation est requis'],
    min: [0, 'Le temps de préparation ne peut pas être négatif']
  },
  cookTime: {
    type: Number,
    required: [true, 'Le temps de cuisson est requis'],
    min: [0, 'Le temps de cuisson ne peut pas être négatif']
  },
  servings: {
    type: Number,
    required: [true, 'Le nombre de portions est requis'],
    min: [1, 'Le nombre de portions doit être au moins 1']
  },
  difficulty: {
    type: String,
    required: [true, 'La difficulté est requise'],
    enum: ['facile', 'moyen', 'difficile'],
    default: 'moyen'
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  nutrition: {
    calories: {
      type: Number,
      required: [true, 'Les calories sont requises'],
      min: [0, 'Les calories ne peuvent pas être négatives']
    },
    protein: {
      type: Number,
      required: [true, 'Les protéines sont requises'],
      min: [0, 'Les protéines ne peuvent pas être négatives']
    },
    carbs: {
      type: Number,
      required: [true, 'Les glucides sont requis'],
      min: [0, 'Les glucides ne peuvent pas être négatifs']
    },
    fat: {
      type: Number,
      required: [true, 'Les lipides sont requis'],
      min: [0, 'Les lipides ne peuvent pas être négatifs']
    }
  },
  externalId: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    required: [true, 'La source est requise'],
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

// Index pour optimiser les recherches
RecipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
RecipeSchema.index({ category: 1 });
RecipeSchema.index({ difficulty: 1 });
RecipeSchema.index({ prepTime: 1 });
RecipeSchema.index({ externalId: 1 });

// Vérifier si le modèle existe déjà avant de le créer
const Recipe = (mongoose.models.Recipe as mongoose.Model<IRecipe>) || mongoose.model<IRecipe>('Recipe', RecipeSchema);

export default Recipe;
