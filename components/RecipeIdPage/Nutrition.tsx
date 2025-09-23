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

interface NutritionProps {
  recipe: RecipeData;
}

const Nutrition = ({ recipe }: NutritionProps) => {
    return (
        <div className='bg-[#2a2a2a] rounded-[15px] p-6 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'>
            <h3 className='text-[#3b82f6] text-[1.2rem] mb-4 flex items-center gap-2'>
                <span className='text-[1.3rem]'>📊</span> Nutrition per serving
            </h3>
            <div className='grid grid-cols-2 gap-[0.8rem] max-md:grid-cols-1'>
                <div className={styles.nutritionItem}>
                    <div className={styles.nutritionValue}>{recipe.nutrition.calories}</div>
                    <div className={styles.nutritionLabel}>Calories</div>
                </div>
                <div className={styles.nutritionItem}>
                    <div className={styles.nutritionValue}>{recipe.nutrition.protein}g</div>
                    <div className={styles.nutritionLabel}>Protein</div>
                </div>
                <div className={styles.nutritionItem}>
                    <div className={styles.nutritionValue}>{recipe.nutrition.carbs}g</div>
                    <div className={styles.nutritionLabel}>Carbs</div>
                </div>
                <div className={styles.nutritionItem}>
                    <div className={styles.nutritionValue}>{recipe.nutrition.fat}g</div>
                    <div className={styles.nutritionLabel}>Fat</div>
                </div>
            </div>
        </div>
    )
}

export default Nutrition
