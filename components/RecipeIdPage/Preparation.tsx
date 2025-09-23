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

interface PreparationProps {
  recipe: RecipeData;
}

const Preparation = ({ recipe }: PreparationProps) => {
    return (
        <section className='bg-[#2a2a2a] rounded-[15px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'>
            <h2 className='text-[#3b82f6] text-[1.5rem] flex items-center gap-[0.7rem] mb-6'>
                <span className='text-[1.3rem]'>👨‍🍳</span> Instructions
            </h2>
            <div className='[counter-reset:step-counter]'>
                {recipe.instructions.map((instruction, index) => (
                    <div key={index} className={styles.stepItem}>
                        <div className={styles.stepText}>{instruction}</div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Preparation
