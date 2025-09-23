import Buttons from './Buttons';
import { styles } from './styles';

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

interface HeaderProps {
  recipe: RecipeData;
}

const Header = ({ recipe }: HeaderProps) => {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'facile': return 'bg-green-600';
            case 'moyen': return 'bg-yellow-600';
            case 'difficile': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'facile': return 'Easy';
            case 'moyen': return 'Medium';
            case 'difficile': return 'Hard';
            default: return difficulty;
        }
    };

    return (
        <header className='bg-linear-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-[20px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] mb-8'>
            <div className='relative h-[400px] bg-linear-to-br from-[#3b82f6] to-[#64748b] flex justify-center items-center text-[8rem] text-white max-md:h-[250px] max-md:text-[4rem]'>
                {recipe.emoji}
                <span className={`absolute top-6 right-6 ${getDifficultyColor(recipe.difficulty)} text-white px-4 py-2 rounded-[20px] text-[0.9rem] font-bold`}>
                    {getDifficultyText(recipe.difficulty)}
                </span>
                <span className='absolute bottom-6 left-6 bg-black/80 text-white px-4 py-2 rounded-[20px] text-[0.9rem] flex items-center gap-2'>
                    {recipe.prepTime} min
                </span>
            </div>

            <div className='p-8 max-sm:p-6'>
                <h1 className='text-[2.5rem] text-[#3b82f6] mb-4 font-bold max-md:text-[2rem]'>{recipe.title}</h1>
                <p className='text-[1.1rem] text-[#b0b0b0] mb-8 leading-[1.7]'>{recipe.description}</p>

                <div className='flex gap-[0.7rem] mb-8 flex-wrap'>
                    {recipe.tags.map((tag, index) => (
                        <span key={index} className='bg-[#404040] text-[#b0b0b0] px-4 py-2 rounded-[15px] text-[0.9rem] font-medium'>
                            {tag}
                        </span>
                    ))}
                </div>

                <div className='grid [grid-template-columns:1fr_1fr_1fr_1fr] gap-4 mb-8 max-lg:grid-cols-2 max-sm:grid-cols-1'>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{recipe.servings}</span>
                        <span className={styles.statLabel}>Servings</span>
                    </div>

                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{recipe.nutrition.calories}</span>
                        <span className={styles.statLabel}>Calories</span>
                    </div>

                    <div className={styles.statItem}>
                        <span className={styles.statValue}>{recipe.prepTime} min</span>
                        <span className={styles.statLabel}>Prep Time</span>
                    </div>
                </div>

                <Buttons />
            </div>
        </header>
    )
}

export default Header;