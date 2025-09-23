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
      matin: {
        nom: string;
        ingredients: string[];
        temps: string;
        emoji?: string;
      };
      midi: {
        nom: string;
        ingredients: string[];
        temps: string;
        emoji?: string;
      };
      soir: {
        nom: string;
        ingredients: string[];
        temps: string;
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
    required: [true, 'L\'ID utilisateur est requis'],
    ref: 'User'
  },
  preferences: {
    dietType: {
      type: String,
      required: [true, 'Le type de régime est requis'],
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
      required: [true, 'Le nombre de personnes est requis'],
      min: [1, 'Le nombre de personnes doit être au moins 1'],
      max: [20, 'Le nombre de personnes ne peut pas dépasser 20']
    },
    budget: {
      type: String,
      required: [true, 'Le budget est requis'],
      enum: ['faible', 'moyen', 'élevé']
    },
    cookingTime: {
      type: String,
      required: [true, 'Le temps de cuisine est requis'],
      enum: ['rapide', 'moyen', 'long']
    }
  },
  mealPlan: {
    type: Schema.Types.Mixed,
    required: [true, 'Le plan de repas est requis']
  }
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
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

// Index pour optimiser les recherches par utilisateur
MealPlanSchema.index({ userId: 1 });
MealPlanSchema.index({ userId: 1, createdAt: -1 }); // Pour récupérer les plannings les plus récents

// Vérifier si le modèle existe déjà avant de le créer
const MealPlan = mongoose.models.MealPlan || mongoose.model<IMealPlan>('MealPlan', MealPlanSchema);

export default MealPlan;
