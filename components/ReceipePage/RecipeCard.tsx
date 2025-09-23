"use client"
import { useRouter } from 'next/navigation'
import { styles } from "./styles";

interface RecipeData {
  id: string;
  userId?: string;
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

interface RecipeCardProps {
  recipe: RecipeData;
  onDelete?: (recipeId: string) => void;
  onEdit?: (recipe: RecipeData) => void;
  onAddToPlanning?: (recipe: RecipeData) => void;
  currentUserId?: string;
}

const RecipeCard = ({ recipe, onDelete, onEdit, onAddToPlanning, currentUserId }: RecipeCardProps) => {
    const router = useRouter();
    

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-600';
            case 'medium': return 'bg-yellow-600';
            case 'hard': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'Easy';
            case 'medium': return 'Medium';
            case 'hard': return 'Hard';
            default: return difficulty;
        }
    };

    return (
        <article className={styles.recipeTag}>
            <div className={styles.recipeImage}>
                {recipe.emoji}
                <span className={`${styles.recipeDifficulty} ${getDifficultyColor(recipe.difficulty)}`}>
                    {getDifficultyText(recipe.difficulty)}
                </span>
                <span className={styles.recipeTime}>⏱️ {recipe.prepTime} min</span>
            </div>
            <div className={styles.recipeInfo}>
                <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                <p className={styles.recipeDescription}>{recipe.description}</p>
                <div className={styles.recipeTags}>
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className={styles.recipeTagss}>{tag}</span>
                    ))}
                </div>
                <div className={styles.recipeStats}>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>{recipe.servings}</div>
                        <div className={styles.statLabel}>Servings</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>{recipe.nutrition.calories}</div>
                        <div className={styles.statLabel}>Calories</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statValue}>{recipe.prepTime}</div>
                        <div className={styles.statLabel}>Prep Time</div>
                    </div>
                </div>

                <div className={styles.recipeAction}>
                    <button 
                        onClick={() => router.push(`/recipe/${recipe.id}`)} 
                        className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#3b82f6] to-[#64748b] hover:to-blue-700 text-white'
                    >
                        View Recipe
                    </button>
                    <button className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-[#505050] bg-[#404040] text-[#e0e0e0]'>
                        + List
                    </button>
                    {onAddToPlanning && (
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onAddToPlanning(recipe);
                            }}
                            className='flex-1 p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] bg-[#10b981] hover:bg-[#059669] text-white'
                            title="Add to meal plan"
                        >
                            📅 Planning
                        </button>
                    )}
                    {recipe.userId && currentUserId && String(recipe.userId) === String(currentUserId) && (
                        <>
                            {onEdit && (
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onEdit(recipe);
                                    }}
                                    className='p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] bg-blue-600 hover:bg-blue-700 text-white'
                                    title="Edit recipe"
                                >
                                    ✏️
                                </button>
                            )}
                            {onDelete && (
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onDelete(recipe.id);
                                    }}
                                    className='p-[0.8rem] border-none rounded-[8px] font-bold cursor-pointer transition0-all duration-300 ease-in-out text-[0.9rem] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] bg-red-600 hover:bg-red-700 text-white'
                                    title="Delete recipe"
                                >
                                    🗑️
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </article>
    )
}

export default RecipeCard;