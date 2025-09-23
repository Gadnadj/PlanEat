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
  cookTime: number;
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
            <p className="text-[#b0b0b0] text-sm mb-6 md:hidden">Touchez le + pour ajouter à votre liste de courses</p>
            <div className='grid [grid-template-columns:repeat(auto-fit,_minmax(250px,_1fr))] gap-4 max-md:grid-cols-1'>
                {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className={`${styles.ingredientItem} group flex items-center justify-between`}>
                        <div className="flex-1">
                            <span className={styles.ingredientName}>{ingredient.name}</span>
                            <span className={styles.ingredientQuantity}>
                                {ingredient.amount} {ingredient.unit || ''}
                            </span>
                        </div>
                        <button
                            onClick={() => onAddIngredient(ingredient)}
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm px-4 py-2 rounded ml-2 md:text-xs md:px-3 md:py-1"
                            title="Ajouter à la liste de courses"
                        >
                            +
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Ingredients
