import React from 'react'
import { styles } from './styles'

interface RecipeData {
  id: string;
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
  prepTime: number;
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
}

interface IngredientsProps {
  recipe: RecipeData;
  onAddIngredient: (ingredient: { name: string; amount: string; unit?: string }) => void;
}

const Ingredients = ({ recipe, onAddIngredient }: IngredientsProps) => {
    return (
        <section className='bg-[#2a2a2a] rounded-[15px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'>
            <h2 className='text-[#3b82f6] text-[1.5rem] flex items-center gap-[0.7rem] mb-6'>
                <span className='text-[1.3rem]'>🛒</span> Ingredients
            </h2>
            <p className="text-[#b0b0b0] text-sm mb-6 md:hidden">Tap + to add to your shopping list</p>
            <div className='grid [grid-template-columns:repeat(auto-fit,_minmax(250px,_1fr))] gap-4 max-md:grid-cols-1'>
                {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className={`${styles.ingredientItem} group`}>
                        {/* Layout mobile avec grille pour alignement parfait */}
                        <div className="grid grid-cols-[1fr_auto_auto] md:flex md:items-center md:justify-between w-full gap-2 md:gap-0">
                            {/* Nom de l'ingrédient */}
                            <span className={`${styles.ingredientName} pr-2 md:pr-0`}>{ingredient.name}</span>
                            
                            {/* Quantité alignée à droite sur mobile */}
                            <span className={`${styles.ingredientQuantity} text-right justify-self-end md:justify-self-auto`}>
                                {ingredient.amount} {ingredient.unit || ''}
                            </span>
                            
                            {/* Bouton + */}
                            <button
                                onClick={() => onAddIngredient(ingredient)}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm px-3 py-1 md:px-3 md:py-1 rounded ml-1 md:ml-2 justify-self-end"
                                title="Add to shopping list"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Ingredients
