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
    required: [true, 'L\'ID utilisateur est requis'],
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Le nom de l\'article est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['Fruits & Légumes', 'Viandes & Poissons', 'Produits laitiers', 'Épicerie', 'Boulangerie', 'Boissons', 'Autres'],
    default: 'Autres'
  },
  quantity: {
    type: String,
    trim: true,
    maxlength: [50, 'La quantité ne peut pas dépasser 50 caractères']
  },
  isCompleted: {
    type: Boolean,
    default: false
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
ShoppingItemSchema.index({ userId: 1 });
ShoppingItemSchema.index({ userId: 1, isCompleted: 1 });
ShoppingItemSchema.index({ userId: 1, category: 1 });

// Vérifier si le modèle existe déjà avant de le créer
const ShoppingItem = mongoose.models.ShoppingItem || mongoose.model<IShoppingItem>('ShoppingItem', ShoppingItemSchema);

export default ShoppingItem;
