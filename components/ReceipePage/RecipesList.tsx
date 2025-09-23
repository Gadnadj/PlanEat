import RecipeCard from "./RecipeCard";
// import { styles } from "./styles";
import Link from "next/link";

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

interface RecipesListProps {
    recipes: RecipeData[];
    loading: boolean;
    onDelete?: (recipeId: string) => void;
    onEdit?: (recipe: RecipeData) => void;
    onAddToPlanning?: (recipe: RecipeData) => void;
    currentUserId?: string;
}

const RecipesList = ({ recipes, loading, onDelete, onEdit, onAddToPlanning, currentUserId }: RecipesListProps) => {
    if (loading) {
        return (
            <main className='max-w-[1400px] mx-auto pt-0 px-8 pb-8'>
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
                        <p className="text-[#b0b0b0]">Chargement des recettes...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className='max-w-[1400px] mx-auto pt-0 px-8 pb-8'>
            <div className='flex justify-between items-center mb-8 py-4 border-b border-[#404040] max-md:flex-col max-md:items-start max-md:gap-4'>
                <span className='text-[#b0b0b0] text-base'>{recipes.length} recette{recipes.length > 1 ? 's' : ''} trouvée{recipes.length > 1 ? 's' : ''}</span>
            </div>

            {recipes.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-[#b0b0b0] text-lg mb-4">Aucune recette trouvée</p>
                    <p className="text-[#666]">Essayez de modifier vos critères de recherche</p>
                </div>
            ) : (
                <div className='grid gap-8 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] max-md:grid-cols-1 max-sm:pl-4 max-sm:pr-4' style={{ gridTemplateRows: '1fr' }}>
                    {recipes.map((recipe) => (
                        <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
                        <RecipeCard 
                            recipe={recipe} 
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onAddToPlanning={onAddToPlanning}
                            currentUserId={currentUserId}
                        />
                        </Link>
                    ))}
                </div>
            )}
        </main>
    )
}

export default RecipesList;