import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  preferences?: {
    dietType: string;
    allergies: string[];
    dislikes: string[];
    numberOfPeople: number;
    budget: string;
    cookingTime: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    maxlength: [128, 'Le mot de passe ne peut pas dépasser 128 caractères']
  },
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  preferences: {
    dietType: {
      type: String,
      enum: ['omnivore', 'vegetarian', 'vegan', 'pescatarian'],
      default: 'omnivore'
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
      min: 1,
      max: 20,
      default: 1
    },
    budget: {
      type: String,
      enum: ['faible', 'moyen', 'élevé'],
      default: 'moyen'
    },
    cookingTime: {
      type: String,
      enum: ['rapide', 'moyen', 'long'],
      default: 'moyen'
    }
  }
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  toJSON: {
    transform: function(doc, ret) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (ret as any).password;
      return ret;
    }
  }
});

// Index pour optimiser les recherches par email
UserSchema.index({ email: 1 });

// Middleware pour supprimer le mot de passe des réponses JSON
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (userObject as any).password;
  return userObject;
};

// Vérifier si le modèle existe déjà avant de le créer
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
